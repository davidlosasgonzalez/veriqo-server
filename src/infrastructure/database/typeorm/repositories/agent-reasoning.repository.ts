import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAgentReasoningRepository } from '@/application/interfaces/agent-reasoning-repository.interfact';
import { AgentReasoning } from '@/domain/entities/agent-reasoning.entity';
import { AgentFactEntity } from '@/infrastructure/database/typeorm/entities/agent-fact.entity';
import { AgentReasoningEntity } from '@/infrastructure/database/typeorm/entities/agent-reasoning.entity';
import { AgentVerificationEntity } from '@/infrastructure/database/typeorm/entities/agent-verification.entity';

/**
 * Repositorio para la gestión de AgentReasoning.
 */
@Injectable()
export class AgentReasoningRepository implements IAgentReasoningRepository {
    constructor(
        @InjectRepository(AgentReasoningEntity)
        private readonly reasoningRepo: Repository<AgentReasoningEntity>,
    ) {}

    /**
     * Guarda un razonamiento en base de datos.
     * @param reasoning - Entidad de dominio.
     * @returns Razonamiento persistido.
     */
    async save(reasoning: AgentReasoning): Promise<AgentReasoning> {
        const entity = this.toOrmEntity(reasoning);
        const saved = await this.reasoningRepo.save(entity);

        return this.toDomainEntity(saved);
    }

    /**
     * Transforma un razonamiento de dominio a entidad ORM.
     * @param domain - Razonamiento de dominio.
     * @returns Entidad ORM lista para persistir.
     */
    private toOrmEntity(domain: AgentReasoning): AgentReasoningEntity {
        const entity = new AgentReasoningEntity();

        entity.id = domain.id;
        entity.summary = domain.summary;
        entity.content = domain.content;
        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;

        if (domain.verificationId) {
            const verificationStub = new AgentVerificationEntity();

            verificationStub.id = domain.verificationId;
            entity.verification = verificationStub;
        }

        if (domain.factId) {
            const factStub = new AgentFactEntity();

            factStub.id = domain.factId;
            entity.fact = factStub;
        }

        return entity;
    }

    /**
     * Transforma una entidad ORM a entidad de dominio.
     * @param entity - Entidad cargada desde base de datos.
     * @returns Razonamiento de dominio.
     */
    private toDomainEntity(entity: AgentReasoningEntity): AgentReasoning {
        const domain = new AgentReasoning();

        domain.id = entity.id;
        domain.summary = entity.summary;
        domain.content = entity.content;
        domain.createdAt = entity.createdAt;
        domain.updatedAt = entity.updatedAt;
        domain.verificationId = entity.verification?.id ?? null;
        domain.factId = entity.fact?.id ?? null;

        return domain;
    }
}
