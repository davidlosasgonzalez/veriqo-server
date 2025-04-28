import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAgentFactRepository } from '@/application/interfaces/agent-fact-repository.interface';
import { AgentFact } from '@/domain/entities/agent-fact.entity';
import { AgentVerification } from '@/domain/entities/agent-verification.entity';
import { AgentFactEntity } from '@/infrastructure/database/typeorm/entities/agent-fact.entity';
import { AgentReasoningEntity } from '@/infrastructure/database/typeorm/entities/agent-reasoning.entity';
import { AgentVerificationEntity } from '@/infrastructure/database/typeorm/entities/agent-verification.entity';
import {
    AgentFactCategory,
    AgentFactStatus,
} from '@/shared/types/agent-fact.types';
import { SearchEngineUsed } from '@/shared/types/enums/search-engine-used.enum';

/**
 * Repositorio para la gestión de AgentFact.
 */
@Injectable()
export class AgentFactRepository implements IAgentFactRepository {
    constructor(
        @InjectRepository(AgentFactEntity)
        private readonly agentFactRepo: Repository<AgentFactEntity>,
    ) {}

    /**
     * Guarda un AgentFact en base de datos.
     */
    async save(fact: AgentFact): Promise<AgentFact> {
        const entity = this.toOrmEntity(fact);
        const saved = await this.agentFactRepo.save(entity);

        return this.toDomainEntity(saved);
    }

    /**
     * Busca un AgentFact por su ID.
     */
    async findById(id: string): Promise<AgentFact | null> {
        const found = await this.agentFactRepo.findOne({
            where: { id },
            relations: ['verifications', 'currentReasoning'],
        });

        return found ? this.toDomainEntity(found) : null;
    }

    /**
     * Actualiza el estado, categoría y razonamiento de un AgentFact tras verificación.
     */
    async updateAfterVerification(params: {
        factId: string;
        newStatus: string;
        newCategory: string;
        newReasoning: { summary: string; content: string };
    }): Promise<void> {
        const fact = await this.agentFactRepo.findOne({
            where: { id: params.factId },
            relations: ['currentReasoning'],
        });

        if (!fact) {
            throw new Error(`AgentFact con id ${params.factId} no encontrado`);
        }

        const newReasoningEntity = new AgentReasoningEntity();

        newReasoningEntity.summary = params.newReasoning.summary;
        newReasoningEntity.content = params.newReasoning.content;
        newReasoningEntity.createdAt = new Date();
        newReasoningEntity.updatedAt = new Date();

        fact.status = params.newStatus as AgentFactStatus;
        fact.category = params.newCategory as AgentFactCategory;
        fact.currentReasoning = newReasoningEntity;
        fact.updatedAt = new Date();

        await this.agentFactRepo.save(fact);
    }

    /**
     * Convierte una entidad ORM a dominio.
     */
    private toDomainEntity(entity: AgentFactEntity): AgentFact {
        const fact = new AgentFact();

        fact.id = entity.id;
        fact.status = entity.status;
        fact.category = entity.category;
        fact.createdAt = entity.createdAt;
        fact.updatedAt = entity.updatedAt;
        fact.currentReasoning = entity.currentReasoning
            ? {
                  id: entity.currentReasoning.id,
                  content: entity.currentReasoning.content,
                  summary: entity.currentReasoning.summary,
                  createdAt: entity.currentReasoning.createdAt,
                  updatedAt: entity.currentReasoning.updatedAt,
              }
            : null;
        fact.verifications =
            entity.verifications?.map(this.toDomainVerification) ?? [];

        return fact;
    }

    /**
     * Convierte una verificación ORM a dominio.
     */
    private toDomainVerification(
        entity: AgentVerificationEntity,
    ): AgentVerification {
        const verification = new AgentVerification();

        verification.id = entity.id;
        verification.engineUsed = entity.engineUsed as SearchEngineUsed;
        verification.confidence = entity.confidence;
        verification.sourcesUsed = entity.sourcesUsed;
        verification.sourcesRetrieved = entity.sourcesRetrieved;
        verification.isOutdated = entity.isOutdated;
        verification.createdAt = entity.createdAt;
        verification.updatedAt = entity.updatedAt;
        verification.reasoning = entity.reasoning
            ? {
                  id: entity.reasoning.id,
                  content: entity.reasoning.content,
                  summary: entity.reasoning.summary,
                  createdAt: entity.reasoning.createdAt,
                  updatedAt: entity.reasoning.updatedAt,
              }
            : null;

        return verification;
    }

    /**
     * Convierte una entidad de dominio a ORM.
     */
    private toOrmEntity(domain: AgentFact): AgentFactEntity {
        const entity = new AgentFactEntity();

        entity.id = domain.id;
        entity.status = domain.status;
        entity.category = domain.category;
        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;
        entity.currentReasoning = domain.currentReasoning
            ? Object.assign(new AgentReasoningEntity(), {
                  content: domain.currentReasoning.content,
                  summary: domain.currentReasoning.summary,
              })
            : null;
        entity.verifications = domain.verifications
            ? domain.verifications.map(this.toOrmVerification)
            : [];

        return entity;
    }

    /**
     * Convierte una verificación de dominio a ORM.
     */
    private toOrmVerification(
        domain: AgentVerification,
    ): AgentVerificationEntity {
        const entity = new AgentVerificationEntity();

        entity.id = domain.id;
        entity.engineUsed = domain.engineUsed as SearchEngineUsed;
        entity.confidence = domain.confidence ?? null;
        entity.sourcesUsed = domain.sourcesUsed;
        entity.sourcesRetrieved = domain.sourcesRetrieved;
        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;
        entity.isOutdated = domain.isOutdated ?? false;
        entity.reasoning = domain.reasoning
            ? Object.assign(new AgentReasoningEntity(), {
                  content: domain.reasoning.content,
                  summary: domain.reasoning.summary,
              })
            : null;

        return entity;
    }
}
