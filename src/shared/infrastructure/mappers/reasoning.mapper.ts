import { ReasoningOrmEntity } from '../entities/reasoning.orm-entity';

import { Reasoning } from '@/shared/domain/entities/reasoning';
import { FactReasoning } from '@/shared/domain/value-objects/fact-reasoning.vo';
import { ReasoningSummary } from '@/shared/domain/value-objects/reasoning-summary.vo';

export function toDomainReasoning(entity: ReasoningOrmEntity): Reasoning {
    return new Reasoning(
        entity.id,
        new ReasoningSummary(entity.summary),
        new FactReasoning(entity.content),
        entity.createdAt,
        entity.updatedAt,
        entity.verification?.id ?? null,
        entity.fact?.id ?? null,
    );
}
