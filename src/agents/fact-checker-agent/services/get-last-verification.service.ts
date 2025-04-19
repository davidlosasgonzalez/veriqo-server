import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentVerification } from '@/core/database/entities/agent-verification.entity';
import { ExtendedFact } from '@/shared/types/extended-fact.type';

/**
 * Servicio que devuelve la última verificación factual realizada por el sistema.
 * Incluye claim, status, reasoning, fuentes utilizadas y fecha.
 */
@Injectable()
export class GetLastVerificationService {
    constructor(
        @InjectRepository(AgentVerification)
        private readonly verificationRepo: Repository<AgentVerification>,
    ) {}

    /**
     * Recupera la última verificación factual completa registrada en la base de datos.
     *
     * @returns Verificación con trazabilidad completa o `null` si no existe ninguna.
     */
    async execute(): Promise<ExtendedFact | null> {
        const [verification] = await this.verificationRepo.find({
            order: { createdAt: 'DESC' },
            take: 1,
        });

        if (!verification) return null;

        return {
            id: verification.id,
            claim: verification.claim,
            normalizedClaim: undefined, // o la puedes inferir si la tienes
            status: verification.result,
            reasoning: verification.reasoning ?? null,
            sources_retrieved: verification.sourcesRetrieved ?? [],
            sources_used: verification.sourcesUsed ?? [],
            createdAt: verification.createdAt.toISOString(),
            updatedAt: verification.updatedAt.toISOString(),
        };
    }
}
