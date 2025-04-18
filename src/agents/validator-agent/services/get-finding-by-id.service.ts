import { Injectable, Logger } from '@nestjs/common';
import { EventBusService } from '@/shared/events/event-bus.service';
import { FactCheckAwaitService } from '@/shared/facts/runtime/fact-check-await.service';
import { FactCheckLockService } from '@/shared/facts/runtime/fact-check-lock.service';
import { AgentFactService } from '@/shared/facts/services/agent-fact.service';
import { AgentFindingService } from '@/shared/facts/services/agent-finding.service';
import { ValidationFinding } from '@/shared/types/validation-finding.type';

/**
 * Servicio principal del ValidatorAgent.
 * Gestiona el análisis de texto, deduplicación de findings, comparación con facts previos
 * y emisión de eventos de verificación factual cuando es necesario.
 */
@Injectable()
export class GetFindingByIdService {
    constructor(
        private readonly agentFindingService: AgentFindingService,
        private readonly factService: AgentFactService,
    ) {}

    /**
     * Recupera un finding específico y lo enriquece con datos de fact previos si existen.
     * @param id ID del finding
     * @returns Finding enriquecido o null si no existe.
     */
    async execute(id: string): Promise<ValidationFinding | null> {
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
}
