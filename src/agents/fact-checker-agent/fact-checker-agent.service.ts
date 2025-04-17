import { Injectable } from '@nestjs/common';
import {
    ChatCompletionMessageParam,
    ChatCompletionSystemMessageParam,
    ChatCompletionUserMessageParam,
} from 'openai/resources/chat';
import { ExecuteFactCheckerDto } from './dto/execute-fact-checker.dto';
import { EventBusService } from '@/shared/events/event-bus.service';
import { FactualCheckRequiredEventPayload } from '@/shared/events/payloads/factual-check-required-event.payload';
import { AgentEventPayload } from '@/shared/events/types/agent-event-payload.type';
import { AgentEventType } from '@/shared/events/types/agent-event-type.enum';
import { AgentFactService } from '@/shared/facts/services/agent-fact.service';
import { AgentVerificationService } from '@/shared/facts/services/agent-verification.service';
import { LlmRouterService } from '@/shared/llm/llm-router.service';
import { ParsedLLMResponse } from '@/shared/llm/types/parsed-llm-response.type';
import { AgentLoggerService } from '@/shared/logger/agent-logger.service';
import { AgentPromptService } from '@/shared/prompts/agent-prompt.service';
import { FallbackSearchService } from '@/shared/search/fallback-search.service';
import { FactCheckerResult } from '@/shared/types/fact-checker-result.type';
import { SearchEngineUsed } from '@/shared/types/search-engine-used.type';
import { VerificationVerdict } from '@/shared/types/verification-verdict.type';

/**
 * Servicio principal del agente FactChecker. Se encarga de buscar información,
 * consultar al modelo LLM y emitir la verificación factual.
 */
@Injectable()
export class FactCheckerAgentService {
    private lastResult: FactCheckerResult | null = null;

    constructor(
        private readonly logger: AgentLoggerService,
        private readonly eventBus: EventBusService,
        private readonly factService: AgentFactService,
        private readonly ai: LlmRouterService,
        private readonly promptService: AgentPromptService,
        private readonly verificationService: AgentVerificationService,
        private readonly fallbackSearch: FallbackSearchService,
    ) {}

    /**
     * Ejecuta el agente de verificación factual para un claim dado.
     * @param executeFactCheckerDto Datos de entrada para el agente
     * @returns Resultado completo de la verificación factual
     */
    async verifyClaim(
        executeFactCheckerDto: ExecuteFactCheckerDto & {
            normalizedClaim?: string;
        },
    ): Promise<FactCheckerResult> {
        const { claim, findingId, normalizedClaim } = executeFactCheckerDto;

        let engineUsed: SearchEngineUsed = 'unknown';

        const factEquivalent =
            await this.factService.findSimilarByEmbedding(claim);

        if (factEquivalent) {
            const verification = await this.verificationService.findByClaim(
                factEquivalent.claim,
            );

            const result: FactCheckerResult = {
                claim,
                equivalentToClaim: factEquivalent.claim,
                status: factEquivalent.status ?? 'unknown',
                sources: factEquivalent.sources ?? [],
                checkedAt: factEquivalent.updatedAt.toISOString(),
                reasoning: verification?.reasoning ?? '[Sin explicación]',
                sources_retrieved: verification?.sourcesRetrieved ?? [],
                sources_used: verification?.sourcesUsed ?? [],
                findingId,
            };

            this.lastResult = result;

            await this.eventBus.emitEvent({
                type: AgentEventType.FACTUAL_VERIFICATION_RESULT,
                sourceAgent: 'FactCheckerAgent',
                data: result,
            });

            return result;
        }

        const normalized =
            normalizedClaim?.trim().toLowerCase() || claim.trim().toLowerCase();

        const cached = await this.factService.findByNormalizedClaim(normalized);

        if (cached) {
            const verification =
                await this.verificationService.findByClaim(claim);

            const result: FactCheckerResult = {
                claim: cached.claim,
                status: cached.status ?? 'unknown',
                sources: cached.sources ?? [],
                checkedAt: cached.updatedAt.toISOString(),
                reasoning: verification?.reasoning ?? '[Sin explicación]',
                sources_retrieved: verification?.sourcesRetrieved ?? [],
                sources_used: verification?.sourcesUsed ?? [],
                findingId,
            };

            this.lastResult = result;

            return result;
        }

        const { results: retrievedResults, engineUsed: engine } =
            await this.fallbackSearch.perform(claim);

        engineUsed = engine;

        const allUrls: string[] = retrievedResults.map((s) => s.url);
        const topUrls = allUrls.slice(0, 5);

        const systemPrompt =
            await this.promptService.findPromptByAgent('fact_checker_agent');

        const sourcesAsText = retrievedResults
            .map((s, i) => `${i + 1}. ${s.url} ${s.snippet ?? ''}`)
            .join('');

        const messages: ChatCompletionMessageParam[] = [
            {
                role: 'system',
                content: systemPrompt,
            } as ChatCompletionSystemMessageParam,
            {
                role: 'user',
                content: `Texto a verificar:\n${claim}\n\nFuentes:\n${sourcesAsText}`,
            } as ChatCompletionUserMessageParam,
        ];

        let status: VerificationVerdict = 'unknown';
        let explanation = '[Sin explicación]';
        let usedUrls: string[] = [];

        try {
            const response = await this.ai.chatWithAgent(
                'factchecker',
                messages,
            );

            const parsed = JSON.parse(response) as ParsedLLMResponse;

            if (
                parsed &&
                typeof parsed === 'object' &&
                ['true', 'false', 'possibly_true', 'unknown'].includes(
                    parsed.status,
                )
            ) {
                status = parsed.status;
                explanation = parsed.reasoning || explanation;

                if (
                    status === 'false' &&
                    explanation.match(/coinciden|corresponden|se alinean/i)
                ) {
                    status = 'possibly_true';
                }

                if (
                    Array.isArray(parsed.sources_used) &&
                    parsed.sources_used.every((s) => typeof s === 'string')
                ) {
                    usedUrls = parsed.sources_used;
                }
            }
        } catch (err) {
            this.logger.error(
                `[FactCheckerAgent] Claude parsing error: ${err.message}`,
            );
        }

        const cleanedSources = retrievedResults.map((s) => ({
            url: s.url,
            domain: s.domain ?? 'unknown',
            snippet: s.snippet ?? undefined,
        }));

        await this.verificationService.saveVerification(
            'fact_checker_agent',
            claim,
            status,
            explanation,
            cleanedSources,
            allUrls,
            usedUrls,
            findingId,
        );

        await this.factService.create(
            'fact_checker_agent',
            claim,
            status,
            topUrls,
            normalized,
        );

        if (findingId) {
            await this.eventBus.markAsProcessedByFindingId(findingId);
        }

        const result: FactCheckerResult = {
            claim,
            status,
            sources: topUrls,
            checkedAt: new Date().toISOString(),
            reasoning: explanation,
            sources_retrieved: allUrls,
            sources_used: usedUrls,
            findingId,
        };

        this.lastResult = result;

        await this.logger.create(
            'FactCheckerAgent',
            'news+brave+google+claude',
            claim,
            JSON.stringify(result),
            0,
            0,
            {
                engineUsed,
                totalResults: result?.sources_retrieved?.length ?? 0,
            },
        );

        await this.eventBus.emitEvent({
            type: AgentEventType.FACTUAL_VERIFICATION_RESULT,
            sourceAgent: 'FactCheckerAgent',
            data: result,
        });

        return result;
    }

    /**
     * Devuelve el último resultado procesado por el agente, si existe.
     */
    getLastResult(): FactCheckerResult | null {
        return this.lastResult;
    }

    /**
     * Maneja la recepción de un evento factual_check_required.
     */
    async handleFactualCheckRequired(
        payload: AgentEventPayload<FactualCheckRequiredEventPayload>,
    ): Promise<void> {
        const { claim, context, findingId } = payload.data;

        await this.verifyClaim({
            claim,
            context: context ?? 'context_not_provided',
            findingId,
        });
    }
}
