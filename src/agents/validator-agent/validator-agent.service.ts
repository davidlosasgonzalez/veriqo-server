import { Injectable, Logger } from '@nestjs/common';
import { env } from '@/config/env/env.config';
import {
    AgentFinding,
    AgentFindingCategory,
} from '@/core/database/entities/agent-finding.entity';
import { EventBusService } from '@/shared/events/event-bus.service';
import { FactualCheckRequiredEventPayload } from '@/shared/events/payloads/factual-check-required-event.payload';
import { AgentEventPayload } from '@/shared/events/types/agent-event-payload.type';
import { AgentEventType } from '@/shared/events/types/agent-event-type.enum';
import { FactCheckAwaitService } from '@/shared/facts/runtime/fact-check-await.service';
import { FactCheckLockService } from '@/shared/facts/runtime/fact-check-lock.service';
import { AgentFactService } from '@/shared/facts/services/agent-fact.service';
import { AgentFindingService } from '@/shared/facts/services/agent-finding.service';
import { ValidationFinding } from '@/shared/types/validation-finding.type';
import { buildSimpleSearchQuery } from '@/shared/utils/search/simple-query-builder';

/**
 * Servicio principal del ValidatorAgent.
 * Gestiona el análisis de texto, deduplicación de findings, comparación con facts previos
 * y emisión de eventos de verificación factual cuando es necesario.
 */
@Injectable()
export class ValidatorAgentService {
    private readonly logger = new Logger(ValidatorAgentService.name);

    constructor(
        private readonly agentFindingService: AgentFindingService,
        private readonly eventBusService: EventBusService,
        private readonly factService: AgentFactService,
        private readonly lockService: FactCheckLockService,
        private readonly awaitService: FactCheckAwaitService,
    ) {}

    /**
     * Ejecuta el proceso completo de análisis semántico y verificación factual opcional.
     * @param prompt Texto a validar.
     * @param waitForFact Si true, espera la verificación factual antes de continuar.
     * @returns Lista de findings enriquecidos con información factual si aplica.
     */
    async verifyClaim(
        prompt: string,
        waitForFact = false,
    ): Promise<ValidationFinding[]> {
        const findings = await this.agentFindingService.analyzeText(prompt);
        const results: ValidationFinding[] = [];

        for (const finding of findings) {
            finding.category = Object.values(AgentFindingCategory).includes(
                finding.category,
            )
                ? finding.category
                : AgentFindingCategory.OTHER;

            finding.searchQuery = finding.searchQuery?.trim().length
                ? finding.searchQuery
                : buildSimpleSearchQuery(
                      finding.claim,
                      finding.keywords ?? [],
                      Object.values(finding.synonyms ?? {}).flat(),
                      finding.siteSuggestions ?? [],
                  );

            const existing =
                await this.agentFindingService.findByNormalizedClaim(
                    finding.normalizedClaim!,
                );

            if (existing) {
                const daysDiff =
                    (Date.now() - new Date(existing.updatedAt).getTime()) /
                    (1000 * 3600 * 24);

                if (daysDiff < 30) {
                    const fact = existing.relatedFactId
                        ? await this.factService.findById(
                              existing.relatedFactId,
                          )
                        : null;

                    results.push({
                        id: existing.id,
                        claim: existing.claim,
                        category: existing.category,
                        summary: existing.summary,
                        explanation: existing.explanation,
                        suggestion: existing.suggestion,
                        keywords: existing.keywords ?? [],
                        synonyms: existing.synonyms ?? {},
                        namedEntities: existing.namedEntities ?? [],
                        locations: existing.locations ?? [],
                        searchQuery: existing.searchQuery ?? '',
                        needsFactCheck: existing.needsFactCheck,
                        needsFactCheckReason:
                            existing.needsFactCheckReason ?? '',
                        siteSuggestions: existing.siteSuggestions ?? [],
                        relatedFactId: existing.relatedFactId ?? undefined,
                        factStatus: fact?.status ?? 'unknown',
                        factCheckedAt: fact?.updatedAt?.toISOString(),
                        factSourcesUsed: fact?.sources ?? [],
                        factIsConclusive: fact?.status !== 'unknown',
                    });

                    continue;
                }
            }

            const factEquivalent =
                await this.factService.findSimilarByEmbedding(finding.claim);

            let factStatus: string | undefined = 'unknown';
            let factCheckedAt: string | undefined;
            let factSourcesUsed: string[] = [];
            let factIsConclusive: boolean | undefined;

            if (factEquivalent) {
                const isRecent =
                    new Date(factEquivalent.updatedAt).getTime() >
                    Date.now() - (env.FACT_CHECK_CACHE_DAYS ?? 7) * 86400000;

                if (isRecent) {
                    finding.relatedFactId = factEquivalent.id;
                    factStatus = factEquivalent.status ?? 'unknown';
                    factCheckedAt = factEquivalent.updatedAt.toISOString();
                    factSourcesUsed = factEquivalent.sources ?? [];
                    factIsConclusive = factEquivalent.status !== 'unknown';

                    finding.explanation = `Se encontraron evidencias previas verificadas por el FactCheckerAgent el ${new Date(
                        factEquivalent.updatedAt,
                    ).toLocaleDateString()}, indicando que la afirmación es "${factEquivalent.status}".`;

                    finding.summary = 'Verificación reciente disponible.';
                    finding.needsFactCheck = false;
                    finding.needsFactCheckReason =
                        'La afirmación coincide con una verificación previa reciente y fiable.';
                }
            }

            if (
                finding.needsFactCheck &&
                this.lockService.isLocked(finding.normalizedClaim!)
            ) {
                finding.needsFactCheck = false;
                finding.needsFactCheckReason =
                    'Ya hay una verificación en curso para esta afirmación.';
            }

            const saved = await this.agentFindingService.create(finding);

            if (finding.needsFactCheck) {
                const locked = this.lockService.tryLock(
                    finding.normalizedClaim!,
                );

                if (locked) {
                    const payload: AgentEventPayload<FactualCheckRequiredEventPayload> =
                        {
                            type: AgentEventType.FACTUAL_CHECK_REQUIRED,
                            sourceAgent: 'ValidatorAgent',
                            data: {
                                claim: finding.claim,
                                keywords: finding.keywords ?? [],
                                findingId: saved.id,
                                searchQuery: finding.searchQuery ?? '',
                            },
                        };

                    await this.eventBusService.emitEvent(payload);
                    this.logger.debug(
                        `[ValidatorAgent] Emitted FACTUAL_CHECK_REQUIRED for claim: "${finding.claim}"`,
                    );
                } else {
                    this.logger.debug(
                        `[ValidatorAgent] Lock no adquirido para: "${finding.normalizedClaim}". Evento no emitido.`,
                    );
                }

                if (waitForFact) {
                    this.logger.debug(
                        `[ValidatorAgent] Esperando resultado factual para: ${finding.normalizedClaim}`,
                    );
                    const resolved =
                        await this.awaitService.waitForFactResolution(
                            finding.normalizedClaim!,
                        );
                    if (resolved) {
                        factStatus = resolved.status ?? 'unknown';
                        factCheckedAt = resolved.updatedAt?.toISOString();
                        factSourcesUsed = resolved.sources ?? [];
                        factIsConclusive = resolved.status !== 'unknown';

                        finding.relatedFactId = resolved.id;
                        finding.needsFactCheck = false;
                        finding.needsFactCheckReason =
                            'Resultado factual recibido durante la espera.';
                        finding.summary =
                            'Verificación factual recibida y aplicada automáticamente.';

                        let updatedAtDate: Date;
                        const rawDate = resolved.updatedAt;

                        if (rawDate instanceof Date) {
                            updatedAtDate = rawDate;
                        } else if (
                            typeof rawDate === 'string' ||
                            typeof rawDate === 'number'
                        ) {
                            updatedAtDate = new Date(rawDate);
                        } else {
                            updatedAtDate = new Date();
                        }

                        finding.explanation = `El FactCheckerAgent verificó esta afirmación el ${updatedAtDate.toLocaleDateString()} con estado "${resolved.status}".`;

                        await this.agentFindingService.create(finding);
                    }
                }
            }

            this.logger.debug(`[ValidatorAgent] DTO push preview:`, {
                id: saved.id,
                claim: saved.claim,
                factStatus,
                factIsConclusive,
                relatedFactId: saved.relatedFactId,
            });

            results.push({
                id: saved.id,
                claim: saved.claim,
                category: saved.category,
                summary: saved.summary,
                explanation: saved.explanation,
                suggestion: saved.suggestion,
                keywords: saved.keywords ?? [],
                synonyms: saved.synonyms ?? {},
                namedEntities: saved.namedEntities ?? [],
                locations: saved.locations ?? [],
                searchQuery: saved.searchQuery ?? '',
                needsFactCheck: saved.needsFactCheck,
                needsFactCheckReason: saved.needsFactCheckReason ?? '',
                siteSuggestions: saved.siteSuggestions ?? [],
                relatedFactId: saved.relatedFactId ?? undefined,
                factStatus,
                factCheckedAt,
                factSourcesUsed,
                factIsConclusive,
            });
        }

        return results;
    }

    /**
     * Recupera un finding específico y lo enriquece con datos de fact previos si existen.
     * @param id ID del finding
     * @returns Finding enriquecido o null si no existe.
     */
    async getFindingById(id: string): Promise<ValidationFinding | null> {
        const entity = await this.agentFindingService.findById(id);
        if (!entity) return null;

        const fact =
            entity.relatedFactId && entity.normalizedClaim
                ? await this.factService.findByNormalizedClaim(
                      entity.normalizedClaim,
                  )
                : null;

        return {
            id: entity.id,
            claim: entity.claim,
            category: entity.category,
            summary: entity.summary,
            explanation: entity.explanation,
            suggestion: entity.suggestion,
            keywords: entity.keywords ?? [],
            synonyms: entity.synonyms ?? {},
            namedEntities: entity.namedEntities ?? [],
            locations: entity.locations ?? [],
            searchQuery: entity.searchQuery ?? '',
            needsFactCheck: entity.needsFactCheck,
            needsFactCheckReason: entity.needsFactCheckReason ?? '',
            siteSuggestions: entity.siteSuggestions ?? [],
            relatedFactId: entity.relatedFactId ?? undefined,
            factStatus: fact?.status ?? 'unknown',
            factCheckedAt: fact?.updatedAt?.toISOString(),
            factSourcesUsed: fact?.sources ?? [],
        };
    }

    /**
     * Devuelve todos los findings actuales del sistema, sin enriquecer.
     */
    async getAllFindings(): Promise<AgentFinding[]> {
        return this.agentFindingService.findAll();
    }
}
