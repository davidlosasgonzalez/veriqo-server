import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ExecuteFactCheckerDto } from '../dto/execute-fact-checker.dto';
import { AgentFactDto } from '@/shared/facts/dto/agent-fact.dto';
import { AgentFactService } from '@/shared/facts/services/agent-fact.service';
import { AgentVerificationService } from '@/shared/facts/services/agent-verification.service';
import { normalizeClaim } from '@/shared/utils/text/normalize-claim';

/**
 * Servicio para obtener un fact previamente verificado a partir de una afirmación textual.
 * Aplica normalización y fallback a AgentVerification si no se encuentra el fact.
 */
@Injectable()
export class GetFactByClaimService {
    constructor(
        private readonly agentFactService: AgentFactService,
        private readonly verificationService: AgentVerificationService,
    ) {}

    /**
     * Busca un `AgentFact` o, en su defecto, un `AgentVerification` para el claim proporcionado.
     * @param executeFactCheckerDto DTO con la afirmación original.
     * @returns DTO enriquecido si existe una verificación previa.
     */
    async execute(
        executeFactCheckerDto: ExecuteFactCheckerDto,
    ): Promise<AgentFactDto | null> {
        const normalized = normalizeClaim(executeFactCheckerDto.claim);

        const fact =
            await this.agentFactService.findByNormalizedClaimAny(normalized);
        if (fact) {
            return plainToInstance(AgentFactDto, fact, {
                excludeExtraneousValues: true,
            });
        }

        const verification = await this.verificationService.findByClaim(
            executeFactCheckerDto.claim,
        );
        if (!verification) return null;

        // Construimos un DTO fake desde la verificación
        return plainToInstance(
            AgentFactDto,
            {
                id: verification.id,
                claim: verification.claim,
                normalizedClaim: normalized,
                status: verification.result,
                sourcesRetrieved: verification.sourcesRetrieved ?? [],
                sourcesUsed: verification.sourcesUsed ?? [],
                reasoning: verification.reasoning ?? null,
                createdAt: verification.createdAt,
                updatedAt: verification.updatedAt,
            },
            { excludeExtraneousValues: true },
        );
    }
}
