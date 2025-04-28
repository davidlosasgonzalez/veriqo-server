import { Inject, Injectable } from '@nestjs/common';
import { CreateAgentFactUseCaseWrite } from '../../use-cases/write/create-agent-fact.use-case.write';
import { CreateAgentFindingSearchContextUseCaseWrite } from '../../use-cases/write/create-agent-finding-search-context.use-case.write';
import { CreateAgentFindingUseCaseWrite } from '../../use-cases/write/create-agent-finding.use-case.write';
import { CreateAgentReasoningUseCaseWrite } from '../../use-cases/write/create-agent-reasoning.use-case.write';
import { IAgentFactRepository } from '@/application/interfaces/agent-fact-repository.interface';
import { IAgentFindingRepository } from '@/application/interfaces/agent-finding-repository.interface';
import { AgentFactRepositoryToken } from '@/application/tokens/agent-fact-repository.token';
import { AgentFindingRepositoryToken } from '@/application/tokens/agent-finding-repository.token';
import { EmbeddingServiceToken } from '@/application/tokens/embedding.token';
import { NormalizeClaimsUseCaseRead } from '@/application/use-cases/read/normalized-claims.use-case.read';
import { env } from '@/config/env/env.config';
import { AgentFinding } from '@/domain/entities/agent-finding.entity';
import { AgentReasoning } from '@/domain/entities/agent-reasoning.entity';
import { EventBusService } from '@/shared/event-bus/event-bus.service';
import { IEmbeddingService } from '@/shared/interfaces/embedding-service.interface';
import { LlmRouterService } from '@/shared/llm/services/llm-router.service';
import { PromptService } from '@/shared/llm/services/prompt.service';
import { AgentFactStatus } from '@/shared/types/agent-fact.types';
import { AgentEventType } from '@/shared/types/enums/agent-event-type.enum';
import { LLMProvider } from '@/shared/types/enums/llm-provider.enum';
import { AgentPromptRole } from '@/shared/types/parsed-types/agent-prompt.types';
import { NormalizedClaim } from '@/shared/types/parsed-types/normalized-claim.type';
import { ValidatedClaimResultPayload } from '@/shared/types/payloads/validated-claim-result.payload';
import { buildClaudePrompt } from '@/shared/utils/llm/build-claude-prompt';

/**
 * Caso de uso WRITE para orquestar el flujo completo de verificación de un claim textual.
 */
@Injectable()
export class ValidatorOrchestratorService {
    constructor(
        @Inject(EmbeddingServiceToken)
        private readonly embeddingService: IEmbeddingService,
        @Inject(AgentFindingRepositoryToken)
        private readonly agentFindingRepository: IAgentFindingRepository,
        @Inject(AgentFactRepositoryToken)
        private readonly agentFactRepository: IAgentFactRepository,
        private readonly normalizeClaims: NormalizeClaimsUseCaseRead,
        private readonly createFact: CreateAgentFactUseCaseWrite,
        private readonly createFinding: CreateAgentFindingUseCaseWrite,
        private readonly createReasoning: CreateAgentReasoningUseCaseWrite,
        private readonly createSearchContext: CreateAgentFindingSearchContextUseCaseWrite,
        private readonly llmRouterService: LlmRouterService,
        private readonly eventBusService: EventBusService,
        private readonly promptService: PromptService,
    ) {}

    /**
     * Orquesta el flujo de validación de un claim: normaliza, deduplica, valida y decide.
     *
     * @param input Texto a verificar.
     * @returns Lista de AgentFinding generados (uno por cada afirmación no duplicada).
     */
    async execute(input: { claim: string }): Promise<AgentFinding[]> {
        const normalizedClaims: NormalizedClaim[] =
            await this.normalizeClaims.execute(input.claim);
        const results: AgentFinding[] = [];

        for (const claim of normalizedClaims) {
            const embedding = await this.embeddingService.generate(claim);
            const similar =
                await this.agentFindingRepository.findMostSimilarEmbedding(
                    embedding,
                    env.EMBEDDING_SIMILARITY_THRESHOLD,
                );

            if (similar?.fact) {
                console.log('[FACT MATCHED]', similar.fact.id);
                await this.createFinding.execute(
                    claim,
                    similar.fact,
                    embedding,
                );

                const fullFinding =
                    await this.agentFindingRepository.findByClaim(claim);

                if (fullFinding) {
                    results.push(fullFinding);
                }

                continue;
            }

            const validation = await this.validateClaimInternally(claim);
            const fact = await this.createFact.execute({
                claim,
                status: validation.status,
                category: validation.category,
            });
            const finding = await this.createFinding.execute(
                claim,
                fact,
                embedding,
            );

            if (validation.needsFactCheckReason) {
                const fullFindingBeforeUpdate =
                    await this.agentFindingRepository.findById(finding.id);

                if (fullFindingBeforeUpdate) {
                    fullFindingBeforeUpdate.needsFactCheckReason =
                        validation.needsFactCheckReason;
                    await this.agentFindingRepository.save(
                        fullFindingBeforeUpdate,
                    );
                } else {
                    console.warn(
                        `[ValidatorOrchestratorService] No se encontró el finding con id ${finding.id} para actualizar needsFactCheckReason.`,
                    );
                }
            }

            if (fact.status === AgentFactStatus.FACT_CHECKING) {
                this.eventBusService.emit(
                    AgentEventType.FACTUAL_CHECK_REQUIRED,
                    {
                        factId: fact.id,
                        findingId: finding.id,
                        claim: claim,
                        keywords: validation.keywords ?? [],
                        synonyms: validation.synonyms ?? null,
                        searchQuery: validation.searchQuery ?? {},
                        siteSuggestions: validation.siteSuggestions ?? null,
                    },
                );

                await this.createSearchContext.execute({
                    findingId: finding.id,
                    keywords: validation.keywords ?? [],
                    synonyms: validation.synonyms ?? null,
                    searchQuery: validation.searchQuery ?? {},
                    siteSuggestions: validation.siteSuggestions ?? null,
                    searchResults: validation.searchResults ?? null,
                });
            } else {
                const reasoning: AgentReasoning =
                    await this.createReasoning.execute({
                        summary: validation.summary ?? '',
                        content: validation.reasoning ?? '',
                    });

                fact.currentReasoning = reasoning;

                await this.agentFactRepository.save(fact);
            }

            const fullFinding = await this.agentFindingRepository.findById(
                finding.id,
            );

            if (fullFinding) {
                results.push(fullFinding);
            }
        }

        return results;
    }

    /**
     * Valida una afirmación normalizada usando el modelo Claude y el prompt FACT_INTERNAL_VALIDATE.
     *
     * @param claim Afirmación normalizada a validar.
     * @returns Objeto con status, categoría y trazabilidad semántica.
     * @throws Error si el modelo no responde correctamente o si la respuesta no es un JSON válido.
     */
    private async validateClaimInternally(
        claim: string,
    ): Promise<ValidatedClaimResultPayload> {
        const systemPrompt = await this.promptService.findPromptByTypeAndRole(
            'FACT_INTERNAL_VALIDATE',
            AgentPromptRole.SYSTEM,
        );
        const userPrompt = await this.promptService.findPromptByTypeAndRole(
            'FACT_INTERNAL_VALIDATE',
            AgentPromptRole.USER,
        );

        if (!systemPrompt || !userPrompt) {
            throw new Error(
                'No se encontraron prompts SYSTEM o USER para el agente validator_agent.',
            );
        }

        const currentDatetime = new Date().toISOString();
        const systemPromptContent = systemPrompt.content.replace(
            '{{current_datetime}}',
            currentDatetime,
        );
        const userPromptContent = userPrompt.content.replace('{{text}}', claim);
        const messages = buildClaudePrompt(
            systemPromptContent,
            userPromptContent,
        );
        const raw = await this.llmRouterService.chat(
            messages,
            LLMProvider.CLAUDE,
        );

        try {
            const parsed = JSON.parse(raw);

            if (!parsed.status || typeof parsed.status !== 'string') {
                throw new Error('Respuesta inválida del modelo LLM.');
            }

            const allowedStatuses = [
                'validated',
                'rejected',
                'fact_checking',
                'error',
            ];

            if (!allowedStatuses.includes(parsed.status as AgentFactStatus)) {
                throw new Error(
                    `Status inválido devuelto por el modelo: ${parsed.status}`,
                );
            }

            return {
                status: parsed.status as AgentFactStatus,
                category: parsed.category,
                summary: parsed.summary,
                reasoning: parsed.reasoning,
                needsFactCheckReason: parsed.needsFactCheckReason,
                keywords: parsed.keywords,
                synonyms: parsed.synonyms,
                searchQuery: parsed.searchQuery,
                siteSuggestions: parsed.siteSuggestions,
            };
        } catch (err) {
            console.error('[LLM PARSE ERROR]', err);
            throw new Error('La respuesta del modelo no es un JSON válido.');
        }
    }
}
