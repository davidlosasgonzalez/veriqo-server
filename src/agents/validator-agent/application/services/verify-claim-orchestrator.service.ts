import { Inject, Injectable, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { CreateFactCommand } from '../commands/fact/create-fact.command';
import { CreateFindingSearchContextCommand } from '../commands/finding/create-finding-search-context.command';
import { CreateFindingCommand } from '../commands/finding/create-finding.command';
import { ValidatorOrchestratorCommand } from '../commands/validator-orchestrator/validator-orchestrator.command';
import { ValidatedClaimResultPayload } from '../dto/validated-claim-result.payload';
import { NormalizeClaimsQuery } from '../queries/normalize/normalize-claims.query';

import { Finding } from '@/agents/validator-agent/domain/entities/finding';
import { env } from '@/config/env/env.config';
import { AGENT_PROMPT_ROLE } from '@/shared/domain/enums/agent-prompt-role.enum';
import { FACT_STATUS } from '@/shared/domain/enums/fact-status.enum';
import { LlmModel } from '@/shared/domain/enums/llm-model.enum';
import { LlmProvider } from '@/shared/domain/enums/llm-provider.enum';
import { IEmbeddingService } from '@/shared/domain/interfaces/embedding-service.interface';
import { IFindingRepository } from '@/shared/domain/interfaces/finding-repository.interface';
import { IReasoningRepository } from '@/shared/domain/interfaces/reasoning-repository.interface';
import { NormalizedClaim } from '@/shared/domain/value-objects/normalized-claim.vo';
import { EventBusService } from '@/shared/event-bus/event-bus.service';
import { FactualCheckRequiredEvent } from '@/shared/events/factual-check-required-event.payload';
import { AgentPromptService } from '@/shared/llm/services/agent-prompt.service';
import { LlmRouterService } from '@/shared/llm/services/llm-router.service';
import { EmbeddingServiceToken } from '@/shared/tokens/embedding-service.token';
import { FindingRepositoryToken } from '@/shared/tokens/finding-repository.token';
import { ReasoningRepositoryToken } from '@/shared/tokens/reasoning-repository.token';
import { ValidatedClaimResultRaw } from '@/shared/types/parsed-types/validated-claim-result-raw.type';
import { buildClaudePrompt } from '@/shared/utils/llm/build-claude-prompt';
import { mapToValidatedClaimResult } from '@/shared/utils/llm/map-to-validated-claim-result';
import { parseLlmResponse } from '@/shared/utils/text/parse-llm-response';

@Injectable()
export class VerifyClaimOrchestratorService {
    private readonly logger = new Logger(VerifyClaimOrchestratorService.name);

    constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
        @Inject(FindingRepositoryToken)
        private readonly findingRepository: IFindingRepository,
        @Inject(ReasoningRepositoryToken)
        private readonly reasoningRepository: IReasoningRepository,
        @Inject(EmbeddingServiceToken)
        private readonly embeddingService: IEmbeddingService,
        private readonly llmRouter: LlmRouterService,
        private readonly promptService: AgentPromptService,
        private readonly eventBus: EventBusService,
    ) {}

    async execute(command: ValidatorOrchestratorCommand): Promise<Finding[]> {
        const findings: Finding[] = [];

        const normalizedClaims: NormalizedClaim[] = await this.queryBus.execute(
            new NormalizeClaimsQuery({ claim: command.payload.claim }),
        );

        for (const claim of normalizedClaims) {
            const embedding = await this.embeddingService.generate(claim);

            const similar =
                await this.findingRepository.findMostSimilarEmbedding(
                    embedding,
                    env.EMBEDDING_SIMILARITY_THRESHOLD,
                );

            if (similar?.getFact()) {
                this.logger.log(`Encontrado fact equivalente para: "${claim}"`);

                const finding: Finding = await this.commandBus.execute(
                    new CreateFindingCommand({
                        claim,
                        fact: similar.getFact(),
                        embedding,
                    }),
                );

                const findingFound: Finding | null =
                    await this.findingRepository.findById(finding.getId());

                if (findingFound) findings.push(findingFound);
                continue;
            }

            const validation = await this.validateClaimInternally(claim);

            const fact = await this.commandBus.execute(
                new CreateFactCommand({
                    status: validation.status,
                    category: validation.category,
                }),
            );

            const finding: Finding = await this.commandBus.execute(
                new CreateFindingCommand({
                    claim,
                    fact,
                    embedding,
                    needsFactCheckReason:
                        validation.needsFactCheckReason ?? null,
                }),
            );

            if (validation.needsFactCheckReason) {
                const foundFinding: Finding | null =
                    await this.findingRepository.findById(finding.getId());

                if (foundFinding) {
                    foundFinding.setNeedsFactCheckReason(
                        validation.needsFactCheckReason,
                    );
                    await this.findingRepository.save(foundFinding);
                }
            }

            if (fact.getStatus() === FACT_STATUS.FACT_CHECKING) {
                this.logger.debug('Emitiendo FACTUAL_CHECK_REQUIRED:', {
                    factId: fact.getId(),
                    findingId: finding.getId(),
                });

                this.eventBus.publish(
                    new FactualCheckRequiredEvent({
                        factId: fact.getId(),
                        findingId: finding.getId(),
                        claim,
                        searchQuery: validation.searchQuery ?? {},
                        siteSuggestions: validation.siteSuggestions ?? null,
                    }),
                );

                await this.commandBus.execute(
                    new CreateFindingSearchContextCommand({
                        findingId: finding.getId(),
                        searchQuery: validation.searchQuery ?? {},
                        siteSuggestions: validation.siteSuggestions ?? null,
                    }),
                );
            }

            const findingFound: Finding | null =
                await this.findingRepository.findById(finding.getId());

            if (findingFound) findings.push(findingFound);
        }

        return findings;
    }

    private async validateClaimInternally(
        claim: string,
    ): Promise<ValidatedClaimResultPayload> {
        const [system, user] = await Promise.all([
            this.promptService.findPromptByTypeAndRole(
                'FACT_INTERNAL_VALIDATE',
                AGENT_PROMPT_ROLE.SYSTEM,
            ),
            this.promptService.findPromptByTypeAndRole(
                'FACT_INTERNAL_VALIDATE',
                AGENT_PROMPT_ROLE.USER,
            ),
        ]);

        if (!system || !user) {
            throw new Error(
                'Prompts SYSTEM o USER faltantes para FACT_INTERNAL_VALIDATE.',
            );
        }

        const systemText = system.content.replaceAll(
            '{{current_datetime}}',
            new Date().toISOString(),
        );
        const userText = user.content.replace('{{text}}', claim);

        const messages = buildClaudePrompt(systemText, userText);

        const { rawOutput } = await this.llmRouter.chat(
            messages,
            env.LLM_VALIDATOR_PROVIDER as LlmProvider,
            env.LLM_VALIDATOR_MODEL as LlmModel,
        );

        const parsedRaw = parseLlmResponse<ValidatedClaimResultRaw>(rawOutput);

        return mapToValidatedClaimResult(parsedRaw);
    }
}
