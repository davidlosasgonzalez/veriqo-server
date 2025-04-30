import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { AgentFactEntity } from '../entities/agent-fact.entity';
import { AgentReasoningDto } from '@/agents/validator/dto/agent-reasoning.dto';
import { AgentVerificationDto } from '@/agents/validator/dto/agent-verification.dto';
import { IAgentVerificationRepository } from '@/application/interfaces/agent-verification-repository.interface';
import { AgentReasoning } from '@/domain/entities/agent-reasoning.entity';
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
     * @param verification - Verificación de dominio a guardar.
     * @returns Verificación guardada como entidad de dominio.
     */
    async save(verification: AgentVerification): Promise<AgentVerification> {
        const entity = this.toOrmEntity(verification);
        const saved = await this.agentVerificationRepo.save(entity);
        const savedVerification = await this.findById(saved.id);

        if (!savedVerification) {
            throw new Error(
                `Error interno: la verificación ${saved.id} no se pudo recuperar después del guardado.`,
            );
        }

        return savedVerification;
    }

    /**
     * Busca una verificación por su ID.
     * @param id - UUID de la verificación.
     * @returns Entidad de dominio o null si no se encuentra.
     */
    async findById(id: string): Promise<AgentVerification | null> {
        const found = await this.agentVerificationRepo.findOne({
            where: { id },
            relations: ['reasoning'],
        });

        return found ? this.toDomainEntity(found) : null;
    }

    /**
     * Convierte una entidad ORM a una entidad de dominio.
     * @param entity - Entidad ORM de AgentVerification.
     * @returns Verificación como entidad de dominio.
     */
    private toDomainEntity(entity: AgentVerificationEntity): AgentVerification {
        const verification = new AgentVerification();

        verification.id = entity.id;
        verification.engineUsed = entity.engineUsed ?? null;
        verification.confidence = entity.confidence ?? null;
        verification.sourcesUsed = entity.sourcesUsed ?? [];
        verification.sourcesRetrieved = entity.sourcesRetrieved ?? [];
        verification.isOutdated = entity.isOutdated ?? false;
        verification.createdAt = entity.createdAt;
        verification.updatedAt = entity.updatedAt;

        if (entity.reasoning) {
            verification.reasoning = this.toDomainReasoning(entity.reasoning);
        }

        verification.factId = entity.fact?.id ?? null;

        return verification;
    }

    /**
     * Convierte una entidad de dominio a entidad ORM.
     * @param domain - Verificación de dominio.
     * @returns Entidad ORM lista para persistencia.
     */
    private toOrmEntity(domain: AgentVerification): AgentVerificationEntity {
        const entity = new AgentVerificationEntity();

        if (domain.id) {
            entity.id = domain.id;
        }

        entity.engineUsed = (domain.engineUsed as SearchEngineUsed) ?? null;
        entity.confidence = domain.confidence ?? null;
        entity.sourcesUsed = domain.sourcesUsed ?? [];
        entity.sourcesRetrieved = domain.sourcesRetrieved ?? [];
        entity.isOutdated = domain.isOutdated ?? false;
        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;

        if (domain.reasoning) {
            entity.reasoning = this.toOrmReasoning(domain.reasoning);
        }

        if (domain.factId) {
            const factStub = new AgentFactEntity();

            factStub.id = domain.factId;
            entity.fact = factStub;
        }

        return entity;
    }

    /**
     * Convierte un razonamiento ORM a entidad de dominio.
     * @param entity - Entidad ORM de AgentReasoning.
     * @returns Razonamiento de dominio.
     */
    private toDomainReasoning(entity: AgentReasoningEntity): AgentReasoning {
        const reasoning = new AgentReasoning();

        reasoning.id = entity.id;
        reasoning.summary = entity.summary;
        reasoning.content = entity.content;
        reasoning.createdAt = entity.createdAt;
        reasoning.updatedAt = entity.updatedAt;
        reasoning.verificationId = entity.verification?.id ?? null;
        reasoning.factId = entity.fact?.id ?? null;

        return reasoning;
    }

    /**
     * Convierte un razonamiento de dominio a entidad ORM.
     * @param domain - Razonamiento de dominio.
     * @returns Entidad ORM lista para guardar.
     */
    private toOrmReasoning(domain: AgentReasoning): AgentReasoningEntity {
        const entity = new AgentReasoningEntity();

        if (domain.id) {
            entity.id = domain.id;
        }

        entity.summary = domain.summary;
        entity.content = domain.content;
        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;

        return entity;
    }

    /**
     * Mapea una entidad de dominio AgentVerification a su DTO de salida.
     * Incluye el razonamiento asociado si está disponible.
     *
     * @param verification - Entidad de dominio AgentVerification.
     * @returns DTO listo para respuesta pública.
     */
    mapToDto(verification: AgentVerification): AgentVerificationDto {
        const dto = plainToInstance(AgentVerificationDto, verification, {
            excludeExtraneousValues: true,
        });

        if (verification.reasoning) {
            dto.reasoning = plainToInstance(
                AgentReasoningDto,
                verification.reasoning,
                { excludeExtraneousValues: true },
            );
        }

        return dto;
    }
}
