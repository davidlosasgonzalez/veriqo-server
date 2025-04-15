import { Injectable } from '@nestjs/common';
import {
    ChatCompletionMessageParam,
    ChatCompletionSystemMessageParam,
    ChatCompletionUserMessageParam,
} from 'openai/resources/chat';
import { ExecuteFactCheckerDto } from './dto/execute-fact-checker.dto';
import { ClaudeChatService } from '@/shared/ai/claude-chat.service';
import { EventBusService } from '@/shared/events/event-bus.service';
import { FactualCheckRequiredData } from '@/shared/events/payloads/factual-check-required.payload';
import { AgentEventPayload } from '@/shared/events/types/agent-event-payload.type';
import { AgentEventType } from '@/shared/events/types/agent-event-type.enum';
import { AgentFactService } from '@/shared/facts/agent-fact.service';
import { AgentVerificationService } from '@/shared/facts/agent-verification.service';
import { AgentLoggerService } from '@/shared/logger/agent-logger.service';
import { AgentPromptService } from '@/shared/prompts/agent-prompt.service';
import { BraveSearchService } from '@/shared/search/brave-search.service';
import { GoogleSearchService } from '@/shared/search/google-search.service';
import { VerificationVerdict } from '@/shared/types/verification-verdict.type';

type LastResult = {
    claim: string;
    status: VerificationVerdict;
    sources: string[];
    checkedAt: string;
    reasoning: string;
    sources_retrieved: string[];
    sources_used: string[];
    findingId?: string;
};

@Injectable()
export class FactCheckerAgentService {
    private lastResult: LastResult | null = null;

    constructor(
        private readonly logger: AgentLoggerService,
        private readonly eventBus: EventBusService,
        private readonly factService: AgentFactService,
        private readonly brave: BraveSearchService,
        private readonly google: GoogleSearchService,
        private readonly claude: ClaudeChatService,
        private readonly promptService: AgentPromptService,
        private readonly verificationService: AgentVerificationService,
    ) {}

    async execute(dto: ExecuteFactCheckerDto): Promise<LastResult> {
        const { claim, context, findingId } = dto;

        const cached = await this.factService.getFactByClaim(claim);
        if (cached) {
            const verification =
                await this.verificationService.getVerificationByClaim(claim);
            const result: LastResult = {
                claim: cached.claim,
                status: cached.status as VerificationVerdict,
                sources: cached.sources,
                checkedAt: cached.updatedAt.toISOString(),
                reasoning: verification?.reasoning ?? '[Sin explicación]',
                sources_retrieved: verification?.sourcesRetrieved ?? [],
                sources_used: verification?.sourcesUsed ?? [],
                findingId,
            };
            this.lastResult = result;
            return result;
        }

        let braveResults: any[] = [];
        try {
            braveResults = await this.brave.search(claim);
        } catch (err) {
            console.log(
                '[BraveSearchService] Fallback automático a Google Search.',
            );
            braveResults = await this.tryGoogleFallback(claim);
        }

        if (!braveResults.length) {
            console.log(
                '[FactCheckerAgent] ❌ No se obtuvieron resultados con Brave ni Google.',
            );
        }

        const allUrls = braveResults.map((s) => s.url);
        const topUrls = allUrls.slice(0, 5);

        const systemPrompt =
            await this.promptService.getPromptForAgent('fact_checker_agent');

        const sourcesAsText = braveResults
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
            const response = await this.claude.chat(messages);
            const parsed = JSON.parse(response);

            if (
                parsed &&
                typeof parsed === 'object' &&
                ['true', 'false', 'possibly_true', 'unknown'].includes(
                    parsed.status,
                )
            ) {
                status = parsed.status;
                explanation = parsed.reasoning || explanation;

                // 🔍 Autoajuste si hay contradicción entre status y reasoning
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

        const cleanedSources = braveResults.map((s) => ({
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

        await this.factService.saveFact(
            'fact_checker_agent',
            claim,
            status,
            topUrls,
        );

        const result: LastResult = {
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

        await this.logger.logUse(
            'FactCheckerAgent',
            'brave+google+claude',
            claim,
            JSON.stringify(result),
            0,
            0,
        );

        await this.eventBus.emit({
            type: AgentEventType.FACTUAL_VERIFICATION_RESULT,
            sourceAgent: 'FactCheckerAgent',
            data: result,
        });

        return result;
    }

    private async tryGoogleFallback(claim: string) {
        const queries = [
            claim,
            claim.replace(/[^\w\s]/gi, '').trim(),
            claim.split(' ').slice(0, 5).join(' '),
        ];

        for (const q of queries) {
            const results = await this.google.search(q);
            if (results.length) {
                console.log(
                    '[GoogleSearchService] ✅ Resultados obtenidos de Google:',
                    results.length,
                );
                return results;
            } else {
                console.log(
                    '[GoogleSearchService] ⚠️ Google no devolvió resultados.',
                );
            }
        }

        return [];
    }

    getLastResult(): LastResult | null {
        return this.lastResult;
    }

    async handleFactualCheckRequired(
        payload: AgentEventPayload<FactualCheckRequiredData>,
    ): Promise<void> {
        const { claim, context, findingId } = payload.data;
        await this.execute({
            claim,
            context: context ?? 'context_not_provided',
            findingId,
        });
    }
}
