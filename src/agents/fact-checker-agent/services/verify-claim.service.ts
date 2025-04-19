import { Injectable } from '@nestjs/common';
import {
    ChatCompletionMessageParam,
    ChatCompletionSystemMessageParam,
    ChatCompletionUserMessageParam,
} from 'openai/resources/chat';
import { ExecuteFactCheckerDto } from '../dto/execute-fact-checker.dto';
import { EventBusService } from '@/shared/events/event-bus.service';
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
 * Servicio principal del agente FactChecker.
 * Se encarga de:
 * - Recuperar verificaciones previas si existen (por claim o claim normalizado)
 * - Ejecutar una verificación factual completa si no hay ninguna disponible
 * - Consultar motores de búsqueda externos y modelos LLM
 * - Guardar y devolver el resultado con trazabilidad completa
 */
@Injectable()
export class VerifyClaimService {
    constructor(
        private readonly logger: AgentLoggerService,
        private readonly eventBus: EventBusService,
        private readonly factService: AgentFactService,
        private readonly llm: LlmRouterService,
        private readonly promptService: AgentPromptService,
        private readonly verificationService: AgentVerificationService,
        private readonly fallbackSearch: FallbackSearchService,
    ) {}

    /**
     * Ejecuta una verificación factual sobre un claim.
     * Si ya existe una verificación previa (exacta o equivalente), la reutiliza.
     * En caso contrario, realiza el análisis LLM, guarda el resultado y emite evento.
     *
     * @param params Objeto con claim obligatorio, y opcionalmente findingId y normalizedClaim.
     * @returns Resultado completo de la verificación factual.
     */
    async execute(params: {
        claim: string;
        findingId?: string;
        normalizedClaim?: string;
    }): Promise<FactCheckerResult> {
        const { claim, findingId, normalizedClaim } = params;

        let engineUsed: SearchEngineUsed = 'unknown';

        const factEquivalent = await this.factService.execute(claim);

        if (factEquivalent) {
            const verification = await this.verificationService.findByClaim(
                factEquivalent.claim,
            );

            const result: FactCheckerResult = {
                id: factEquivalent.id,
                claim,
                equivalentToClaim: factEquivalent.claim,
                status:
                    (factEquivalent.status as VerificationVerdict) ?? 'unknown',
                checkedAt: factEquivalent.updatedAt.toISOString(),
                reasoning: verification?.reasoning ?? '[Sin explicación]',
                sources_retrieved: verification?.sourcesRetrieved ?? [],
                sources_used: verification?.sourcesUsed ?? [],
                findingId,
            };

            return result;
        }

        const normalized =
            normalizedClaim?.trim().toLowerCase() || claim.trim().toLowerCase();

        const cached = await this.factService.findByNormalizedClaim(normalized);

        if (cached) {
            const verification =
                await this.verificationService.findByClaim(claim);

            const result: FactCheckerResult = {
                id: cached.id,
                claim: cached.claim,
                status: (cached.status as VerificationVerdict) ?? 'unknown',
                checkedAt: cached.updatedAt.toISOString(),
                reasoning: verification?.reasoning ?? '[Sin explicación]',
                sources_retrieved: verification?.sourcesRetrieved ?? [],
                sources_used: verification?.sourcesUsed ?? [],
                findingId,
            };

            return result;
        }

        const { results: retrievedResults, engineUsed: engine } =
            await this.fallbackSearch.perform(claim);

        engineUsed = engine;

        const allUrls: string[] = retrievedResults.map((s) => s.url);

        const systemPromptRecord = await this.promptService.getPrompt(
            'fact_checker_agent',
            'FACTCHECK_ANALYZE_STATUS',
        );

        const systemPrompt = systemPromptRecord.prompt;

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
                content: `Texto a verificar:
                    ${claim}

                    Fuentes:
                    ${sourcesAsText}`,
            } as ChatCompletionUserMessageParam,
        ];

        let status: VerificationVerdict = 'unknown';
        let explanation = '[Sin explicación]';
        let usedUrls: string[] = [];

        try {
            const response = await this.llm.chatWithAgent(
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

        const newFact = await this.factService.create(
            'fact_checker_agent',
            claim,
            status,
            normalized,
        );

        if (findingId) {
            await this.eventBus.markAsProcessedByFindingId(findingId);
        }

        const result: FactCheckerResult = {
            id: newFact.id,
            claim,
            status,
            checkedAt: new Date().toISOString(),
            reasoning: explanation,
            sources_retrieved: allUrls,
            sources_used: usedUrls,
            findingId,
        };

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
}
