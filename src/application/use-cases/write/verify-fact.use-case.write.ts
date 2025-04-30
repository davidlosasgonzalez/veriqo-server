import { Inject, Injectable } from '@nestjs/common';
import { ChatCompletionMessageParam } from 'openai/resources/chat';
import { IAgentReasoningRepository } from '@/application/interfaces/agent-reasoning-repository.interfact';
import { AgentReasoningRepositoryToken } from '@/application/tokens/agent-reasoning-repository.token';
import { env } from '@/config/env/env.config';
import { AgentReasoning } from '@/domain/entities/agent-reasoning.entity';
import { AgentVerification } from '@/domain/entities/agent-verification.entity';
import { AgentVerificationRepository } from '@/infrastructure/database/typeorm/repositories/agent-verification.repository';
import { EventBusService } from '@/shared/event-bus/event-bus.service';
import { AgentPromptService } from '@/shared/llm/services/agent-prompt.service';
import { LlmRouterService } from '@/shared/llm/services/llm-router.service';
import { BraveSearchService } from '@/shared/search/services/brave-search.service';
import { FallbackSearchService } from '@/shared/search/services/fallback-search.service';
import { GoogleSearchService } from '@/shared/search/services/google-search.service';
import { StructuredPreviewService } from '@/shared/search/services/structured-preview.service';
import { AgentEventType } from '@/shared/types/enums/agent-event-type.enum';
import { AgentPromptRole } from '@/shared/types/enums/agent-prompt.types';
import { LlmModel } from '@/shared/types/enums/llm-model.types';
import { LlmProvider } from '@/shared/types/enums/llm-provider.enum';
import { SearchEngineUsed } from '@/shared/types/enums/search-engine-used.enum';
import { LlmMessage } from '@/shared/types/parsed-types/llm-message.type';
import { RawSearchResult } from '@/shared/types/raw-search-result.type';
import { buildQuery } from '@/shared/utils/search/build-query';
import { parseLlmResponse } from '@/shared/utils/text/parse-llm-response';

/**
 * Caso de uso WRITE para verificar un fact mediante búsqueda externa y razonamiento estructurado.
 */
@Injectable()
export class VerifyFactUseCaseWrite {
    constructor(
        private readonly braveSearchService: BraveSearchService,
        private readonly googleSearchService: GoogleSearchService,
        private readonly fallbackSearchService: FallbackSearchService,
        private readonly structuredPreviewService: StructuredPreviewService,
        private readonly llmRouterService: LlmRouterService,
        private readonly agentVerificationRepository: AgentVerificationRepository,
        private readonly promptService: AgentPromptService,
        private readonly eventBusService: EventBusService,
        @Inject(AgentReasoningRepositoryToken)
        private readonly reasoningRepository: IAgentReasoningRepository,
    ) {}

    /**
     * Ejecuta la verificación de un claim usando búsquedas externas y modelo LLM.
     * @param factId - ID del fact asociado.
     * @param claim - Afirmación a verificar.
     * @param searchContext - Contexto de búsqueda opcional.
     * @returns Verificación generada.
     */
    async execute(
        factId: string | null,
        claim: string,
        searchContext?: {
            searchQuery?: Record<string, string>;
            siteSuggestions?: string[];
        },
    ): Promise<AgentVerification> {
        const resultsCombined = new Map<string, RawSearchResult>();
        let engineUsed: SearchEngineUsed | null = null;
        const searchEngines = [
            { name: SearchEngineUsed.BRAVE, service: this.braveSearchService },
            {
                name: SearchEngineUsed.GOOGLE,
                service: this.googleSearchService,
            },
            {
                name: SearchEngineUsed.FALLBACK,
                service: this.fallbackSearchService,
            },
        ];

        for (const engine of searchEngines) {
            const { finalQuery, fallbackQuery } = buildQuery(
                claim,
                searchContext?.searchQuery,
            );

            try {
                const primaryResults = await engine.service.search(
                    finalQuery,
                    searchContext?.siteSuggestions,
                );

                primaryResults.forEach((r) => resultsCombined.set(r.url, r));

                if (resultsCombined.size > 0) {
                    engineUsed = engine.name;
                    break;
                }

                if (fallbackQuery) {
                    const fallbackResults = await engine.service.search(
                        fallbackQuery,
                        searchContext?.siteSuggestions,
                    );

                    fallbackResults.forEach((r) =>
                        resultsCombined.set(r.url, r),
                    );

                    if (resultsCombined.size > 0) {
                        engineUsed = engine.name;
                        break;
                    }
                }
            } catch (err: any) {
                if (err.message === 'BRAVE_RATE_LIMIT') continue;
                throw err;
            }
        }

        const searchResults = Array.from(resultsCombined.values());

        if (!searchResults.length || !engineUsed) {
            throw new Error(
                'No se encontraron resultados en ningún motor de búsqueda.',
            );
        }

        const structured =
            await this.structuredPreviewService.process(searchResults);
        const systemPrompt = await this.promptService.findPromptByTypeAndRole(
            'FACTCHECK_ANALYZE_STATUS',
            AgentPromptRole.SYSTEM,
        );
        const userPrompt = await this.promptService.findPromptByTypeAndRole(
            'FACTCHECK_ANALYZE_STATUS',
            AgentPromptRole.USER,
        );

        if (!systemPrompt || !userPrompt) {
            throw new Error(
                'No se encontraron prompts SYSTEM o USER para FACTCHECK_ANALYZE_STATUS.',
            );
        }

        const sourcesAsText = structured
            .map(
                (p, i) =>
                    `${i + 1}. Título: ${p.title}\nResumen: ${p.snippet ?? '[Sin resumen]'}\nURL: ${p.url}`,
            )
            .join('\n\n');
        const chatMessages: ChatCompletionMessageParam[] = [
            { role: 'system', content: systemPrompt.content.trim() },
            {
                role: 'user',
                content: `Texto a verificar:\n${claim}\n\nFuentes:\n${sourcesAsText}`,
            },
        ];
        const messages: LlmMessage[] = chatMessages.map((m) => ({
            role: m.role as 'system' | 'user' | 'assistant',
            content:
                typeof m.content === 'string'
                    ? m.content
                    : JSON.stringify(m.content ?? ''),
        }));

        try {
            const { rawOutput } = await this.llmRouterService.chat(
                messages,
                env.LLM_FACTCHECKER_PROVIDER as LlmProvider,
                env.LLM_FACTCHECKER_MODEL as LlmModel,
            );
            const parsed = parseLlmResponse(rawOutput);
            const now = new Date();
            const verification = new AgentVerification();

            verification.confidence = parsed.confidence ?? null;
            verification.engineUsed = engineUsed;
            verification.isOutdated = false;
            verification.sourcesRetrieved = structured.map((s) => s.url);
            verification.sourcesUsed = parsed.sources_used ?? [];
            verification.createdAt = now;
            verification.updatedAt = now;

            if (factId) {
                verification.factId = factId;
            }

            const savedVerification =
                await this.agentVerificationRepository.save(verification);
            const reasoning = new AgentReasoning();

            Object.assign(reasoning, {
                summary: parsed.summary,
                content: parsed.reasoning,
                createdAt: now,
                updatedAt: now,
                verificationId: savedVerification.id,
            });

            reasoning.verificationId = savedVerification.id;

            const savedReasoning =
                await this.reasoningRepository.save(reasoning);

            savedVerification.reasoning = savedReasoning;

            await this.agentVerificationRepository.save(savedVerification);

            savedVerification.reasoning = {
                id: savedReasoning.id,
                summary: savedReasoning.summary,
                content: savedReasoning.content,
                createdAt: savedReasoning.createdAt,
                updatedAt: savedReasoning.updatedAt,
                verificationId: savedReasoning.verificationId!,
                factId: savedReasoning.factId ?? null,
            };

            if (factId) {
                await this.eventBusService.emit(
                    AgentEventType.FACTUAL_VERIFICATION_RESULT,
                    {
                        factId,
                        newCategory: parsed.category,
                        newStatus: parsed.finalStatus,
                        reasoning: {
                            summary: parsed.summary,
                            content: parsed.reasoning,
                        },
                    },
                );
            }

            return savedVerification;
        } catch (err) {
            console.error('[LLM PARSE ERROR]', err);
            throw new Error('La respuesta del modelo no es un JSON válido.');
        }
    }
}
