import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { AgentFactDto } from '@/agents/fact-checker/dto/agent-fact.dto';
import { AgentReasoningDto } from '@/agents/validator/dto/agent-reasoning.dto';
import { AgentVerificationDto } from '@/agents/validator/dto/agent-verification.dto';
import { IAgentFactRepository } from '@/application/interfaces/agent-fact-repository.interface';
import { AgentFact } from '@/domain/entities/agent-fact.entity';
import { AgentReasoning } from '@/domain/entities/agent-reasoning.entity';
import { AgentVerification } from '@/domain/entities/agent-verification.entity';
import { AgentFactEntity } from '@/infrastructure/database/typeorm/entities/agent-fact.entity';
import { AgentReasoningEntity } from '@/infrastructure/database/typeorm/entities/agent-reasoning.entity';
import { AgentVerificationEntity } from '@/infrastructure/database/typeorm/entities/agent-verification.entity';
import {
    AgentFactCategory,
    AgentFactStatus,
} from '@/shared/types/enums/agent-fact.types';

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
     * @param fact - Entidad de dominio a persistir.
     * @returns Fact guardado como dominio.
     */
    async save(fact: AgentFact): Promise<AgentFact> {
        const entity = this.toOrmEntity(fact);
        const saved = await this.agentFactRepo.save(entity);

        return this.toDomainEntity(saved);
    }

    /**
     * Busca un AgentFact por ID.
     * @param id - UUID del fact.
     * @returns Entidad de dominio o null si no existe.
     */
    async findById(id: string): Promise<AgentFact | null> {
        const found = await this.agentFactRepo.findOne({
            where: { id },
            relations: [
                'verifications',
                'verifications.reasoning',
                'reasonings',
            ],
        });

        return found ? this.toDomainEntity(found) : null;
    }

    /**
     * Recupera todos los AgentFact registrados.
     * @returns Lista de entidades de dominio.
     */
    async findAll(): Promise<AgentFact[]> {
        const all = await this.agentFactRepo.find({
            relations: [
                'verifications',
                'verifications.reasoning',
                'reasonings',
            ],
        });

        return all.map((entity) => this.toDomainEntity(entity));
    }

    /**
     * Actualiza el estado y añade un razonamiento directamente vinculado al fact.
     * @param params - Datos de actualización del fact.
     */
    async updateAfterVerification(params: {
        factId: string;
        newStatus: string;
        newCategory: string;
        newReasoning: { summary: string; content: string };
    }): Promise<void> {
        const fact = await this.agentFactRepo.findOne({
            where: { id: params.factId },
            relations: ['reasonings'],
        });

        if (!fact) {
            throw new Error(`AgentFact con id ${params.factId} no encontrado`);
        }

        const reasoning = new AgentReasoningEntity();

        reasoning.summary = params.newReasoning.summary;
        reasoning.content = params.newReasoning.content;
        reasoning.createdAt = new Date();
        reasoning.updatedAt = new Date();
        reasoning.fact = fact;

        fact.status = params.newStatus as AgentFactStatus;
        fact.category = params.newCategory as AgentFactCategory;
        fact.updatedAt = new Date();

        await this.agentFactRepo.save(fact);
        await this.agentFactRepo.manager.save(reasoning);
    }

    /**
     * Actualiza únicamente el estado factual y la categoría semántica de un AgentFact.
     *
     * Este método se utiliza cuando la verificación factual ya ha generado su propio razonamiento
     * (por ejemplo, desde el agente FactChecker), y solo se requiere actualizar los metadatos del fact.
     *
     * @param params - Objeto con el ID del fact a actualizar, el nuevo estado y la nueva categoría.
     * @throws Error si el fact no existe en la base de datos.
     */
    async updateStatusAndCategory(params: {
        factId: string;
        newStatus: AgentFactStatus;
        newCategory: AgentFactCategory;
    }): Promise<void> {
        const fact = await this.agentFactRepo.findOneBy({ id: params.factId });

        if (!fact)
            throw new Error(`AgentFact con id ${params.factId} no encontrado`);

        fact.status = params.newStatus;
        fact.category = params.newCategory;
        fact.updatedAt = new Date();

        await this.agentFactRepo.save(fact);
    }

    /**
     * Convierte una entidad ORM a entidad de dominio.
     * @param entity - Entidad ORM cargada de base de datos.
     * @returns Entidad de dominio.
     */
    private toDomainEntity(entity: AgentFactEntity): AgentFact {
        const fact = new AgentFact();

        fact.id = entity.id;
        fact.status = entity.status;
        fact.category = entity.category;
        fact.createdAt = entity.createdAt;
        fact.updatedAt = entity.updatedAt;

        fact.verifications =
            entity.verifications?.map((verification) =>
                this.toDomainVerification(verification),
            ) ?? [];
        fact.reasonings =
            entity.reasonings?.map((reasoning) =>
                this.toDomainReasoning(reasoning),
            ) ?? [];

        return fact;
    }

    /**
     * Convierte una entidad ORM de verificación a dominio.
     * @param entity - Entidad ORM de verificación.
     * @returns Entidad de dominio.
     */
    private toDomainVerification(
        entity: AgentVerificationEntity,
    ): AgentVerification {
        const verification = new AgentVerification();

        verification.id = entity.id;
        verification.engineUsed = entity.engineUsed ?? null;
        verification.confidence = entity.confidence ?? null;
        verification.sourcesUsed = entity.sourcesUsed ?? [];
        verification.sourcesRetrieved = entity.sourcesRetrieved ?? [];
        verification.isOutdated = entity.isOutdated ?? false;
        verification.createdAt = entity.createdAt;
        verification.updatedAt = entity.updatedAt;

        verification.reasoning = entity.reasoning
            ? this.toDomainReasoning(entity.reasoning)
            : null;

        return verification;
    }

    /**
     * Convierte una entidad ORM de razonamiento a dominio.
     * @param entity - Entidad ORM de razonamiento.
     * @returns Entidad de dominio.
     */
    private toDomainReasoning(entity: AgentReasoningEntity): AgentReasoning {
        const reasoning = new AgentReasoning();

        reasoning.id = entity.id;
        reasoning.summary = entity.summary;
        reasoning.content = entity.content;
        reasoning.verificationId = entity.verification?.id ?? null;
        reasoning.factId = entity.fact?.id ?? null;
        reasoning.createdAt = entity.createdAt;
        reasoning.updatedAt = entity.updatedAt;

        return reasoning;
    }

    /**
     * Convierte una entidad de dominio a entidad ORM.
     * @param domain - Entidad de dominio.
     * @returns Entidad ORM lista para persistir.
     */
    private toOrmEntity(domain: AgentFact): AgentFactEntity {
        const entity = new AgentFactEntity();

        entity.id = domain.id;
        entity.status = domain.status;
        entity.category = domain.category;
        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;

        return entity;
    }

    /**
     * Mapea un AgentFact a su DTO de salida, incluyendo razonamiento o verificación según el caso.
     * @param fact - Entidad de dominio AgentFact.
     * @returns DTO listo para respuesta pública.
     */
    mapToDto(fact: AgentFact): AgentFactDto {
        const dto = plainToInstance(AgentFactDto, fact, {
            excludeExtraneousValues: true,
        });

        if (fact.verifications?.length) {
            dto.verification = plainToInstance(
                AgentVerificationDto,
                fact.verifications[0],
                {
                    excludeExtraneousValues: true,
                },
            );
        } else if (fact.reasonings?.length) {
            dto.reasoning = plainToInstance(
                AgentReasoningDto,
                fact.reasonings[0],
                {
                    excludeExtraneousValues: true,
                },
            );
        }

        return dto;
    }
}
