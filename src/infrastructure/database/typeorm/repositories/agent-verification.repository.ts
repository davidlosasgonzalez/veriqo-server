import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAgentVerificationRepository } from '@/application/interfaces/agent-verification-repository.interface';
import { AgentVerification } from '@/domain/entities/agent-verification.entity';
import { AgentReasoningEntity } from '@/infrastructure/database/typeorm/entities/agent-reasoning.entity';
import { AgentVerificationEntity } from '@/infrastructure/database/typeorm/entities/agent-verification.entity';
import { SearchEngineUsed } from '@/shared/types/enums/search-engine-used.enum';

/**
 * Repositorio para la gestión de AgentVerification.
 */
@Injectable()
export class AgentVerificationRepository
    implements IAgentVerificationRepository
{
    constructor(
        @InjectRepository(AgentVerificationEntity)
        private readonly agentVerificationRepo: Repository<AgentVerificationEntity>,
    ) {}

    /**
     * Guarda una verificación en base de datos.
     */
    async save(verification: AgentVerification): Promise<AgentVerification> {
        const entity = this.toOrmEntity(verification);
        const saved = await this.agentVerificationRepo.save(entity);

        return this.toDomainEntity(saved);
    }

    /**
     * Busca una verificación por su ID.
     */
    async findById(id: string): Promise<AgentVerification | null> {
        const found = await this.agentVerificationRepo.findOne({
            where: { id },
            relations: ['fact', 'reasoning'],
        });

        return found ? this.toDomainEntity(found) : null;
    }

    /**
     * Convierte una entidad ORM en una entidad de dominio.
     */
    private toDomainEntity(entity: AgentVerificationEntity): AgentVerification {
        const verification = new AgentVerification();

        verification.id = entity.id;
        verification.engineUsed = entity.engineUsed as SearchEngineUsed;
        verification.confidence = entity.confidence;
        verification.sourcesUsed = entity.sourcesUsed ?? [];
        verification.sourcesRetrieved = entity.sourcesRetrieved ?? [];
        verification.isOutdated = entity.isOutdated ?? false;
        verification.createdAt = entity.createdAt;
        verification.updatedAt = entity.updatedAt;

        if (entity.reasoning) {
            verification.reasoning = {
                id: entity.reasoning.id,
                content: entity.reasoning.content,
                summary: entity.reasoning.summary,
                createdAt: entity.reasoning.createdAt,
                updatedAt: entity.reasoning.updatedAt,
            };
        }

        if (entity.fact) {
            verification.fact = {
                id: entity.fact.id,
                status: entity.fact.status,
                category: entity.fact.category,
                createdAt: entity.fact.createdAt,
                updatedAt: entity.fact.updatedAt,
            };
        }

        return verification;
    }

    /**
     * Convierte una entidad de dominio en una entidad ORM.
     */
    private toOrmEntity(domain: AgentVerification): AgentVerificationEntity {
        const entity = new AgentVerificationEntity();

        entity.id = domain.id;
        entity.engineUsed = domain.engineUsed as SearchEngineUsed;
        entity.confidence = domain.confidence ?? null;
        entity.sourcesUsed = domain.sourcesUsed ?? [];
        entity.sourcesRetrieved = domain.sourcesRetrieved ?? [];
        entity.isOutdated = domain.isOutdated ?? false;
        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;

        if (domain.reasoning) {
            entity.reasoning = Object.assign(new AgentReasoningEntity(), {
                content: domain.reasoning.content,
                summary: domain.reasoning.summary,
            });
        }

        if (domain.fact) {
            entity.fact = { id: domain.fact.id } as any; // Asociación por ID solamente
        }

        return entity;
    }
}
