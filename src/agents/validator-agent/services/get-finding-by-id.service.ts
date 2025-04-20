import { Injectable } from '@nestjs/common';
import { AgentFactService } from '@/shared/facts/services/agent-fact.service';
import { AgentFindingService } from '@/shared/facts/services/agent-finding.service';
import { AgentVerificationService } from '@/shared/facts/services/agent-verification.service';
import { ValidationFinding } from '@/shared/types/validation-finding.type';

/**
 * Servicio principal del ValidatorAgent.
 * Gestiona el análisis de texto, deduplicación de findings, comparación con facts previos
 * y enriquecimiento con razonamiento factual.
 */
@Injectable()
export class GetFindingByIdService {
    constructor(
        private readonly agentFindingService: AgentFindingService,
        private readonly factService: AgentFactService,
        private readonly verificationService: AgentVerificationService,
    ) {}

    /**
     * Recupera un finding específico y lo enriquece con datos del fact relacionado y su verificación,
     * incluyendo razonamiento y fuentes usadas si están disponibles.
     *
     * @param id ID del finding a consultar.
     * @returns DTO con información completa del hallazgo.
     */
    async execute(id: string): Promise<ValidationFinding | null> {
        const entity = await this.agentFindingService.findById(id);
        if (!entity) return null;

        const fact =
            entity.relatedFactId && entity.normalizedClaim
                ? await this.factService.findByNormalizedClaimAny(
                      entity.normalizedClaim,
                  )
                : null;

        const verification = fact
            ? await this.verificationService.findByClaim(fact.claim)
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
            factSourcesUsed: verification?.sourcesUsed ?? [],
            factReasoning: verification?.reasoning ?? null,
        };
    }
}
