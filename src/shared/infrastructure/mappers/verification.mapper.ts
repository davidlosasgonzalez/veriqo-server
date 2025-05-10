import { VerificationOrmEntity } from '../entities/verification.orm-entity';

import { toDomainReasoning } from './reasoning.mapper';

import { Verification } from '@/shared/domain/entities/verification';

export function toDomainVerification(
    entity: VerificationOrmEntity,
): Verification {
    return new Verification(
        entity.id,
        entity.engineUsed ?? null,
        entity.confidence ?? null,
        entity.sourcesRetrieved ?? [],
        entity.sourcesUsed ?? [],
        entity.isOutdated ?? false,
        entity.createdAt,
        entity.updatedAt,
        entity.reasoning ? toDomainReasoning(entity.reasoning) : null,
        entity.fact?.id ?? null,
    );
}
