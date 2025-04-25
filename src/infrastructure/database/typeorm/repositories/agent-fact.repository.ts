import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentReasoningEntity } from '../entities/agent-reasoning.entity';
import { AgentVerificationEntity } from '../entities/agent-verification.entity';
import { IAgentFactRepository } from '@/application/interfaces/agent-fact-repository.interface';
import { AgentFact } from '@/domain/entities/agent-fact.entity';
import { AgentVerification } from '@/domain/entities/agent-verification.entity';
import { AgentFactEntity } from '@/infrastructure/database/typeorm/entities/agent-fact.entity';

@Injectable()
export class AgentFactRepository implements IAgentFactRepository {
    constructor(
        @InjectRepository(AgentFactEntity)
        private readonly ormRepo: Repository<AgentFactEntity>,
    ) {}

    /**
     * Guarda un AgentFact en base de datos.
     *
     * @param fact Objeto de dominio a persistir.
     * @returns AgentFact guardado con ID y timestamps.
     */
    async save(fact: AgentFact): Promise<AgentFact> {
        const entity = this.toOrmEntity(fact);
        const saved = await this.ormRepo.save(entity);

        return this.toDomainEntity(saved);
    }

    /**
     * Busca un AgentFact por su identificador.
     *
     * @param id ID único del fact.
     * @returns El fact si existe, o null.
     */
    async findById(id: string): Promise<AgentFact | null> {
        const found = await this.ormRepo.findOne({
            where: { id },
            relations: ['verifications', 'reasoning'],
        });

        return found ? this.toDomainEntity(found) : null;
    }

    private toDomainEntity(entity: AgentFactEntity): AgentFact {
        const fact = new AgentFact();

        fact.id = entity.id;
        fact.status = entity.status;
        fact.category = entity.category ?? null;
        fact.reasoning = entity.reasoning
            ? {
                  id: entity.reasoning.id,
                  content: entity.reasoning.content,
                  summary: entity.reasoning.summary,
                  createdAt: entity.reasoning.createdAt,
                  updatedAt: entity.reasoning.updatedAt,
              }
            : null;
        fact.createdAt = entity.createdAt;
        fact.updatedAt = entity.updatedAt;
        fact.verifications =
            entity.verifications?.map(this.toDomainVerification) ?? null;

        return fact;
    }

    private toDomainVerification(
        entity: AgentVerificationEntity,
    ): AgentVerification {
        const verification = new AgentVerification();

        verification.id = entity.id;
        verification.method = entity.method;
        verification.confidence = entity.confidence;
        verification.sourcesUsed = entity.sourcesUsed;
        verification.sourcesRetrieved = entity.sourcesRetrieved;
        verification.isOutdated = entity.isOutdated;
        verification.createdAt = entity.createdAt;
        verification.updatedAt = entity.updatedAt;
        verification.reasoning = {
            id: entity.reasoning.id,
            content: entity.reasoning.content,
            summary: entity.reasoning.summary,
            createdAt: entity.reasoning.createdAt,
            updatedAt: entity.reasoning.updatedAt,
        };

        return verification;
    }

    private toOrmEntity(domain: AgentFact): AgentFactEntity {
        const entity = new AgentFactEntity();

        entity.id = domain.id;
        entity.status = domain.status;
        entity.category = domain.category ?? null;
        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;
        entity.reasoning = domain.reasoning
            ? Object.assign(new AgentReasoningEntity(), {
                  content: domain.reasoning.content,
                  summary: domain.reasoning.summary,
              })
            : null;
        entity.verifications = domain.verifications
            ? domain.verifications.map(this.toOrmVerification)
            : null;

        return entity;
    }

    private toOrmVerification(
        domain: AgentVerification,
    ): AgentVerificationEntity {
        const entity = new AgentVerificationEntity();

        entity.id = domain.id;
        entity.method = domain.method;
        entity.confidence = domain.confidence;
        entity.sourcesUsed = domain.sourcesUsed ?? null;
        entity.sourcesRetrieved = domain.sourcesRetrieved ?? null;
        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;
        entity.isOutdated = domain.isOutdated ?? false;
        entity.reasoning = Object.assign(new AgentReasoningEntity(), {
            content: domain.reasoning.content,
            summary: domain.reasoning.summary,
        });

        return entity;
    }
}
