import { randomUUID } from 'crypto';

import { Inject, Injectable, Logger } from '@nestjs/common';

import { VerifyFactCommand } from '../../../commands/verify/verify-fact.command';

import { env } from '@/config/env/env.config';
import { Reasoning } from '@/shared/domain/entities/reasoning';
import { Verification } from '@/shared/domain/entities/verification';
import { AGENT_PROMPT_ROLE } from '@/shared/domain/enums/agent-prompt-role.enum';
import { type LlmModel } from '@/shared/domain/enums/llm-model.enum';
import { type LlmProvider } from '@/shared/domain/enums/llm-provider.enum';
import {
    SEARCH_ENGINE_USED,
    type SearchEngineUsed,
} from '@/shared/domain/enums/search-engine-used.enum';
import { IReasoningRepository } from '@/shared/domain/interfaces/reasoning-repository.interface';
import { IVerificationRepository } from '@/shared/domain/interfaces/verification-repository.interface';
import { FactReasoning } from '@/shared/domain/value-objects/fact-reasoning.vo';
import { ReasoningSummary } from '@/shared/domain/value-objects/reasoning-summary.vo';
import { EventBusService } from '@/shared/event-bus/event-bus.service';
import { FactualVerificationResultEvent } from '@/shared/events/factual-verification-result.event';
import { AgentPromptService } from '@/shared/llm/services/agent-prompt.service';
import { LlmRouterService } from '@/shared/llm/services/llm-router.service';
import { BraveSearchService } from '@/shared/search/services/brave-search.service';
import { FallbackSearchService } from '@/shared/search/services/fallback-search.service';
import { GoogleSearchService } from '@/shared/search/services/google-search.service';
import { StructuredPreviewService } from '@/shared/search/services/structured-preview.service';
import { ReasoningRepositoryToken } from '@/shared/tokens/reasoning-repository.token';
import { VerificationRepositoryToken } from '@/shared/tokens/verification-repository.token';
import { ValidatedClaimResultRaw } from '@/shared/types/parsed-types/validated-claim-result-raw.type';
import { RawSearchResult } from '@/shared/types/raw-search-result.type';
import { buildClaudePrompt } from '@/shared/utils/llm/build-claude-prompt';
import { mapToValidatedClaimResult } from '@/shared/utils/llm/map-to-validated-claim-result';
import { buildQuery } from '@/shared/utils/search/build-query';
import { parseLlmResponse } from '@/shared/utils/text/parse-llm-response';

@Injectable()
export class VerifyFactUseCase {
    private readonly logger = new Logger(VerifyFactUseCase.name);

    constructor(
        private readonly brave: BraveSearchService,
        private readonly google: GoogleSearchService,
        private readonly fallback: FallbackSearchService,
        private readonly previews: StructuredPreviewService,
        private readonly prompts: AgentPromptService,
        private readonly llm: LlmRouterService,
        private readonly eventBus: EventBusService,
        @Inject(VerificationRepositoryToken)
        private readonly verificationRepo: IVerificationRepository,
        @Inject(ReasoningRepositoryToken)
        private readonly reasoningRepo: IReasoningRepository,
    ) {}

    /**
     * Ejecuta la verificación factual de una afirmación mediante búsqueda externa y análisis con LLM.
     */
    async execute(command: VerifyFactCommand): Promise<Verification> {
        const { claim, context } = command.payload;
        const factId = context?.factId;

        const engines = [
            { name: SEARCH_ENGINE_USED.BRAVE, service: this.brave },
            { name: SEARCH_ENGINE_USED.GOOGLE, service: this.google },
            { name: SEARCH_ENGINE_USED.NEWS_API, service: this.fallback },
        ];
        let engineUsed: SearchEngineUsed | null = null;
        let allResults: RawSearchResult[] = [];

        for (const engine of engines) {
            const { finalQuery, fallbackQuery } = buildQuery(
                claim,
                context?.searchQuery,
            );

            try {
                const results = await engine.service.search(
                    finalQuery,
                    context?.siteSuggestions,
                );

                if (results.length > 0) {
                    engineUsed = engine.name;
                    allResults = results;
                    break;
                }

                if (fallbackQuery) {
                    const fallbackResults = await engine.service.search(
                        fallbackQuery,
                        context?.siteSuggestions,
                    );

                    if (fallbackResults.length > 0) {
                        engineUsed = engine.name;
                        allResults = fallbackResults;
                        break;
                    }
                }
            } catch (err: unknown) {
                if (
                    err instanceof Error &&
                    err.message === 'BRAVE_RATE_LIMIT'
                ) {
                    this.logger.warn(
                        `[${engine.name}] Rate limit alcanzado, se continúa con el siguiente motor.`,
                    );
                    continue;
                }

                this.logger.error(
                    `[${engine.name}] Error al consultar el motor de búsqueda`,
                    err instanceof Error ? err.stack : String(err),
                );

                throw err instanceof Error
                    ? err
                    : new Error(
                          'Error inesperado al consultar el motor de búsqueda',
                      );
            }
        }

        if (!allResults.length || !engineUsed) {
            throw new Error('No se encontraron resultados válidos.');
        }

        const structured = await this.previews.processMany(allResults);
        const systemPrompt = await this.prompts.findPromptByTypeAndRole(
            'FACTCHECK_ANALYZE_STATUS',
            AGENT_PROMPT_ROLE.SYSTEM,
        );
        const userPrompt = await this.prompts.findPromptByTypeAndRole(
            'FACTCHECK_ANALYZE_STATUS',
            AGENT_PROMPT_ROLE.USER,
        );

        if (!systemPrompt || !userPrompt) {
            throw new Error('Faltan prompts para FACTCHECK_ANALYZE_STATUS.');
        }

        const fuentes = structured
            .map(
                (p, i) =>
                    `${i + 1}. Título: ${String(p.getTitle())}\nResumen: ${String(p.getSnippet() ?? '[Sin resumen]')}\nURL: ${String(p.getUrl())}`,
            )
            .join('\n\n');

        const messages = buildClaudePrompt(
            String(systemPrompt.content).trim(),
            `${String(claim)}\n\nFuentes:\n${fuentes}`.trim(),
        );

        const { rawOutput } = await this.llm.chat(
            messages,
            env.LLM_FACTCHECKER_PROVIDER as unknown as LlmProvider,
            env.LLM_FACTCHECKER_MODEL as unknown as LlmModel,
        );

        const parsedRaw = parseLlmResponse<ValidatedClaimResultRaw>(rawOutput);
        const result = mapToValidatedClaimResult(parsedRaw);

        if (!result.summary || !result.reasoning) {
            throw new Error(
                'Faltan campos summary o reasoning en la respuesta del modelo.',
            );
        }

        const now = new Date();
        const reasoning = new Reasoning(
            randomUUID(),
            new ReasoningSummary(result.summary),
            new FactReasoning(result.reasoning),
            now,
            now,
            null,
            factId,
        );
        const savedReasoning = await this.reasoningRepo.save(reasoning);

        const confidence =
            parsedRaw.confidence !== undefined
                ? Number(parsedRaw.confidence)
                : null;

        const sourcesUsed = Array.isArray(parsedRaw.sources_used)
            ? parsedRaw.sources_used.map(String)
            : [];

        const retrievedUrls = structured.map((s) => String(s.getUrl()));

        const verification = new Verification(
            crypto.randomUUID(),
            engineUsed,
            confidence,
            retrievedUrls,
            sourcesUsed,
            false,
            now,
            now,
            savedReasoning,
            factId,
        );

        if (!factId) {
            throw new Error(
                'No se puede emitir el evento: factId está indefinido.',
            );
        }

        this.eventBus.publish(
            new FactualVerificationResultEvent({
                factId,
                claim,
                newStatus: result.status,
                newCategory: result.category,
                reasoning: {
                    summary: result.summary,
                    content: result.reasoning,
                },
            }),
        );

        await this.verificationRepo.save(verification);

        return verification;
    }
}
