import {
    Injectable,
    Logger,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { FactOrmEntity } from '../entities/fact.orm-entity';
import { ReasoningOrmEntity } from '../entities/reasoning.orm-entity';
import { VerificationOrmEntity } from '../entities/verification.orm-entity';

import { VerificationDto } from '@/agents/fact-checker/presentation/rest/dto/verification.dto';
import { Reasoning } from '@/shared/domain/entities/reasoning';
import { Verification } from '@/shared/domain/entities/verification';
import { SearchEngineUsed } from '@/shared/domain/enums/search-engine-used.enum';
import { IVerificationRepository } from '@/shared/domain/interfaces/verification-repository.interface';
import { FactReasoning } from '@/shared/domain/value-objects/fact-reasoning.vo';
import { ReasoningSummary } from '@/shared/domain/value-objects/reasoning-summary.vo';
import { ReasoningDto } from '@/shared/presentation/dto/reasoning.dto';

@Injectable()
export class VerificationRepository implements IVerificationRepository {
    private readonly logger = new Logger(VerificationRepository.name);

    constructor(
        @InjectRepository(VerificationOrmEntity)
        private readonly agentVerificationRepo: Repository<VerificationOrmEntity>,
    ) {}

    async save(verification: Verification): Promise<Verification> {
        const entity = this.toOrmEntity(verification);
        const saved = await this.agentVerificationRepo.save(entity);
        const savedVerification = await this.findById(saved.id);

        if (!savedVerification) {
            this.logger.error(
                `Verificación guardada pero no recuperada: ${saved.id}`,
            );

            throw new InternalServerErrorException(
                `No se pudo recuperar la verificación recién guardada.`,
            );
        }

        return savedVerification;
    }

    async findById(id: string): Promise<Verification | null> {
        const found = await this.agentVerificationRepo.findOne({
            where: { id },
            relations: ['reasoning'],
        });

        return found ? this.toDomainEntity(found) : null;
    }

    private toDomainEntity(entity: VerificationOrmEntity): Verification {
        return new Verification(
            entity.id,
            entity.engineUsed ?? null,
            entity.confidence ?? null,
            entity.sourcesUsed ?? [],
            entity.sourcesRetrieved ?? [],
            entity.isOutdated ?? false,
            entity.createdAt,
            entity.updatedAt,
            entity.reasoning
                ? this.toDomainReasoning(entity.reasoning)
                : undefined,
            entity.fact?.id ?? null,
        );
    }

    private toOrmEntity(domain: Verification): VerificationOrmEntity {
        const entity = new VerificationOrmEntity();

        entity.id = domain.getId();
        entity.engineUsed = domain.getEngineUsed() as SearchEngineUsed;
        entity.confidence = domain.getConfidence();
        entity.sourcesUsed = domain.getSourcesUsed();
        entity.sourcesRetrieved = domain.getSourcesRetrieved();
        entity.isOutdated = domain.getIsOutdated();
        entity.createdAt = domain.getCreatedAt();
        entity.updatedAt = domain.getUpdatedAt();

        if (domain.getReasoning()) {
            entity.reasoning = this.toOrmReasoning(domain.getReasoning()!);
        }

        if (domain.getFactId()) {
            const factStub = new FactOrmEntity();
            factStub.id = domain.getFactId()!;
            entity.fact = factStub;
        }

        return entity;
    }

    private toDomainReasoning(entity: ReasoningOrmEntity): Reasoning {
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

    private toOrmReasoning(domain: Reasoning): ReasoningOrmEntity {
        const entity = new ReasoningOrmEntity();

        entity.id = domain.getId();
        entity.summary = domain.getSummary().getValue();
        entity.content = domain.getContent().getValue();
        entity.createdAt = domain.getCreatedAt();
        entity.updatedAt = domain.getUpdatedAt();

        return entity;
    }

    mapToDto(verification: Verification): VerificationDto {
        const dto = plainToInstance(VerificationDto, verification, {
            excludeExtraneousValues: true,
        });

        if (verification.getReasoning()) {
            dto.reasoning = plainToInstance(
                ReasoningDto,
                verification.getReasoning(),
                { excludeExtraneousValues: true },
            );
        }

        return dto;
    }
}
