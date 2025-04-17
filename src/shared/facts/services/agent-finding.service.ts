import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatCompletionMessageParam } from 'openai/resources/chat';
import { Repository, MoreThan } from 'typeorm';
import { AgentFactService } from './agent-fact.service';
import { env } from '@/config/env/env.config';
import {
    AgentFinding,
    AgentFindingCategory,
} from '@/core/database/entities/agent-finding.entity';
import { EventBusService } from '@/shared/events/event-bus.service';
import { FactualCheckRequiredEventPayload } from '@/shared/events/payloads/factual-check-required-event.payload';
import { AgentEventPayload } from '@/shared/events/types/agent-event-payload.type';
import { AgentEventType } from '@/shared/events/types/agent-event-type.enum';
import { ParsedFinding } from '@/shared/facts/types/parsed-finding.type';
import { LlmRouterService } from '@/shared/llm/llm-router.service';
import { AgentLoggerService } from '@/shared/logger/agent-logger.service';
import { AgentPromptService } from '@/shared/prompts/agent-prompt.service';

/**
 * Servicio encargado de analizar textos con un agente LLM,
 * generar findings y emitir eventos si se requiere verificación factual.
 */
@Injectable()
export class AgentFindingService {
    constructor(
        @InjectRepository(AgentFinding)
        private readonly findingRepo: Repository<AgentFinding>,
        private readonly ai: LlmRouterService,
        private readonly promptService: AgentPromptService,
        private readonly logger: AgentLoggerService,
        private readonly eventBus: EventBusService,
        private readonly factService: AgentFactService,
    ) {}

    /**
     * Procesa un texto, genera findings usando LLM y emite eventos si es necesario.
     */
    async analyzeText(prompt: string): Promise<AgentFinding[]> {
        const systemPrompt =
            await this.promptService.findPromptByAgent('validator_agent');

        const messages: ChatCompletionMessageParam[] = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
        ];

        const rawResponse = await this.ai.chatWithAgent('validator', messages);

        await this.logger.create(
            'ValidatorAgent',
            'claude-sonnet',
            prompt,
            rawResponse,
            0,
            0,
        );

        let parsed: { data: ParsedFinding[] };
        try {
            parsed = JSON.parse(rawResponse);
        } catch (err) {
            this.logger.error(
                `[AgentFindingService] Error parsing JSON: ${err}`,
            );
            throw new Error('La respuesta del modelo no es un JSON válido.');
        }

        if (!parsed?.data || !Array.isArray(parsed.data)) {
            throw new Error(
                'La respuesta del modelo no contiene findings válidos.',
            );
        }

        const savedFindings: AgentFinding[] = [];

        for (const item of parsed.data) {
            const normalized = item.normalizedClaim?.trim().toLowerCase();

            if (!normalized) {
                throw new Error(
                    `Claim "${item.claim}" no tiene normalizedClaim`,
                );
            }

            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(
                oneWeekAgo.getDate() - (env.FACT_CHECK_CACHE_DAYS || 7),
            );

            const existingFinding = await this.findingRepo.findOne({
                where: {
                    normalizedClaim: normalized,
                    updatedAt: MoreThan(oneWeekAgo),
                },
            });

            let existingFact =
                await this.factService.findByNormalizedClaim(normalized);

            if (!existingFact) {
                existingFact = await this.factService.findSimilarByEmbedding(
                    item.claim,
                );
            }

            const isRecentFact = existingFact
                ? Date.now() - new Date(existingFact.updatedAt).getTime() <
                  (env.FACT_CHECK_CACHE_DAYS || 7) * 86400000
                : false;

            const needsFactCheck =
                item.needsFactCheck === true && !isRecentFact;

            if (existingFinding) {
                this.logger.debug(
                    `[AgentFindingService] Reusing existing finding for: ${item.claim}`,
                );

                if (
                    isRecentFact &&
                    existingFact?.id &&
                    !existingFinding.relatedFactId
                ) {
                    existingFinding.relatedFactId = existingFact.id;
                }

                Object.assign(existingFinding, {
                    claim: item.claim,
                    summary: item.summary,
                    explanation: item.explanation,
                    suggestion: item.suggestion,
                    keywords: item.keywords ?? [],
                    synonyms: item.synonyms ?? {},
                    namedEntities: item.namedEntities ?? [],
                    locations: item.locations ?? [],
                    searchQuery: item.searchQuery ?? '',
                    siteSuggestions: item.siteSuggestions ?? [],
                    needsFactCheck,
                    needsFactCheckReason: item.needsFactCheckReason ?? '',
                });

                const saved = await this.findingRepo.save(existingFinding);
                savedFindings.push(saved);

                if (needsFactCheck) {
                    await this.emitFactCheckEvent(
                        saved.id,
                        item.claim ?? '',
                        item.keywords ?? [],
                        item.searchQuery ?? '',
                    );
                }

                continue;
            }

            const newFinding = this.findingRepo.create({
                agent: 'validator_agent',
                claim: item.claim,
                normalizedClaim: normalized,
                category: item.category as AgentFindingCategory,
                summary: item.summary,
                explanation: item.explanation,
                suggestion: item.suggestion,
                keywords: item.keywords ?? [],
                synonyms: item.synonyms ?? {},
                namedEntities: item.namedEntities ?? [],
                locations: item.locations ?? [],
                siteSuggestions: item.siteSuggestions ?? [],
                searchQuery: item.searchQuery ?? '',
                needsFactCheck,
                needsFactCheckReason: item.needsFactCheckReason ?? '',
                relatedFactId:
                    isRecentFact && existingFact?.id
                        ? existingFact.id
                        : undefined,
            });

            const saved = await this.findingRepo.save(newFinding);
            savedFindings.push(saved);

            if (needsFactCheck) {
                await this.emitFactCheckEvent(
                    saved.id,
                    item.claim ?? '',
                    item.keywords ?? [],
                    item.searchQuery ?? '',
                );
            }
        }

        return savedFindings;
    }

    /**
     * Emite un evento factual_check_required asociado a un finding.
     */
    private async emitFactCheckEvent(
        findingId: string,
        claim: string,
        keywords: string[] = [],
        searchQuery: string = '',
    ) {
        const payload: AgentEventPayload<FactualCheckRequiredEventPayload> = {
            type: AgentEventType.FACTUAL_CHECK_REQUIRED,
            sourceAgent: 'ValidatorAgent',
            data: {
                claim,
                keywords,
                findingId,
                searchQuery,
            },
        };

        await this.eventBus.emitEvent(payload);
        this.logger.debug(
            `[AgentFindingService] Event FACTUAL_CHECK_REQUIRED emitted for: ${claim}`,
        );
    }

    /** Guarda un finding de forma individual. */
    async create(finding: AgentFinding): Promise<AgentFinding> {
        return this.findingRepo.save(finding);
    }

    /** Devuelve todos los findings existentes. */
    async findAll(): Promise<AgentFinding[]> {
        return this.findingRepo.find({ order: { createdAt: 'DESC' } });
    }

    /** Busca un finding por su ID. */
    async findById(id: string): Promise<AgentFinding | null> {
        return this.findingRepo.findOne({ where: { id } });
    }

    /** Busca un finding por claim normalizado. */
    async findByNormalizedClaim(
        normalized: string,
    ): Promise<AgentFinding | null> {
        return this.findingRepo.findOne({
            where: { normalizedClaim: normalized },
            order: { updatedAt: 'DESC' },
        });
    }
}
