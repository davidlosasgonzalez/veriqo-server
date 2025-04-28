import { Injectable } from '@nestjs/common';
import { ChatCompletionMessageParam } from 'openai/resources/chat';
import { AgentFact } from '@/domain/entities/agent-fact.entity';
import { AgentVerification } from '@/domain/entities/agent-verification.entity';
import { AgentReasoningEntity } from '@/infrastructure/database/typeorm/entities/agent-reasoning.entity';
import { AgentVerificationRepository } from '@/infrastructure/database/typeorm/repositories/agent-verification.repository';
import { EventBusService } from '@/shared/event-bus/event-bus.service';
import { LlmRouterService } from '@/shared/llm/services/llm-router.service';
import { PromptService } from '@/shared/llm/services/prompt.service';
import { BraveSearchService } from '@/shared/search/services/brave-search.service';
import { FallbackSearchService } from '@/shared/search/services/fallback-search.service';
import { GoogleSearchService } from '@/shared/search/services/google-search.service';
import { StructuredPreviewService } from '@/shared/search/services/structured-preview.service';
import { AgentEventType } from '@/shared/types/enums/agent-event-type.enum';
import { LLMProvider } from '@/shared/types/enums/llm-provider.enum';
import { SearchEngineUsed } from '@/shared/types/enums/search-engine-used.enum';
import { AgentPromptRole } from '@/shared/types/parsed-types/agent-prompt.types';
import { LlmMessage } from '@/shared/types/parsed-types/llm-message.type';

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
        private readonly promptService: PromptService,
        private readonly eventBusService: EventBusService,
    ) {}

    /**
     * Ejecuta la verificación de un claim usando búsquedas externas y modelo LLM.
     */
    async execute(
        factId: string | null,
        claim: string,
    ): Promise<AgentVerification> {
        let searchResults = await this.braveSearchService.search(claim);
        let engineUsed: SearchEngineUsed | null = null;

        if (searchResults.length) {
            engineUsed = SearchEngineUsed.BRAVE;
        } else {
            searchResults = await this.googleSearchService.search(claim);

            if (searchResults.length) {
                engineUsed = SearchEngineUsed.GOOGLE;
            } else {
                searchResults = await this.fallbackSearchService.search(claim);

                if (searchResults.length) {
                    engineUsed = SearchEngineUsed.FALLBACK;
                }
            }
        }

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
            .map((p, i) => {
                const snippet = p.snippet || '[Sin resumen]';

                return `${i + 1}. Título: ${p.title}\nResumen: ${snippet}\nURL: ${p.url}`;
            })
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
        const raw = await this.llmRouterService.chat(
            messages,
            LLMProvider.OPENAI,
        );

        try {
            const parsed = JSON.parse(raw);
            const now = new Date();
            const newReasoning = Object.assign(new AgentReasoningEntity(), {
                content: parsed.reasoning,
                summary: parsed.summary,
                createdAt: now,
                updatedAt: now,
            });
            const verification = new AgentVerification();

            verification.confidence = parsed.confidence ?? null;
            verification.engineUsed = engineUsed;
            verification.isOutdated = false;
            verification.sourcesRetrieved = structured.map((s) => s.url);
            verification.sourcesUsed = parsed.sources_used ?? [];
            verification.createdAt = now;
            verification.updatedAt = now;
            verification.reasoning = newReasoning;

            if (factId) {
                const factEntity = new AgentFact();

                factEntity.id = factId;
                verification.fact = factEntity;
            }

            const savedVerification =
                await this.agentVerificationRepository.save(verification);

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
