import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FactOrmEntity } from '../entities/fact.orm-entity';
import { ReasoningOrmEntity } from '../entities/reasoning.orm-entity';
import { VerificationOrmEntity } from '../entities/verification.orm-entity';

import { Reasoning } from '@/shared/domain/entities/reasoning';
import { IReasoningRepository } from '@/shared/domain/interfaces/reasoning-repository.interface';
import { FactReasoning } from '@/shared/domain/value-objects/fact-reasoning.vo';
import { ReasoningSummary } from '@/shared/domain/value-objects/reasoning-summary.vo';

@Injectable()
export class ReasoningRepository implements IReasoningRepository {
    constructor(
        @InjectRepository(ReasoningOrmEntity)
        private readonly repo: Repository<ReasoningOrmEntity>,
    ) {}

    async save(reasoning: Reasoning): Promise<Reasoning> {
        const entity = this.toOrm(reasoning);
        const saved = await this.repo.save(entity);

        return this.toDomain(saved);
    }

    private toOrm(domain: Reasoning): ReasoningOrmEntity {
        const entity = new ReasoningOrmEntity();

        entity.id = domain.getId();
        entity.summary = domain.getSummary().getValue();
        entity.content = domain.getContent().getValue();
        entity.createdAt = domain.getCreatedAt();
        entity.updatedAt = domain.getUpdatedAt();

        if (domain.getVerificationId()) {
            const verification = new VerificationOrmEntity();

            verification.id = domain.getVerificationId()!;
            entity.verification = verification;
        }

        if (domain.getFactId()) {
            const fact = new FactOrmEntity();

            fact.id = domain.getFactId()!;
            entity.fact = fact;
        }

        return entity;
    }

    private toDomain(entity: ReasoningOrmEntity): Reasoning {
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
}
