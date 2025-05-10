import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FactOrmEntity } from '../entities/fact.orm-entity';
import { ReasoningOrmEntity } from '../entities/reasoning.orm-entity';
import { toDomainReasoning } from '../mappers/reasoning.mapper';
import { toDomainVerification } from '../mappers/verification.mapper';

import { Fact } from '@/shared/domain/entities/fact';
import { type FactCategory } from '@/shared/domain/enums/fact-category.enum';
import { type FactStatus } from '@/shared/domain/enums/fact-status.enum';
import { IFactRepository } from '@/shared/domain/interfaces/fact-repository.interface';

@Injectable()
export class FactRepository implements IFactRepository {
    private readonly logger = new Logger(FactRepository.name);

    constructor(
        @InjectRepository(FactOrmEntity)
        private readonly repo: Repository<FactOrmEntity>,
    ) {}

    async save(fact: Fact): Promise<Fact> {
        const entity = this.toOrm(fact);
        const saved = await this.repo.save(entity);

        return this.toDomain(saved);
    }

    async findById(id: string): Promise<Fact | null> {
        const found = await this.repo.findOne({
            where: { id },
            relations: [
                'verifications',
                'verifications.reasoning',
                'reasonings',
            ],
        });

        return found ? this.toDomain(found) : null;
    }

    async findAll(): Promise<Fact[]> {
        const all = await this.repo.find({
            relations: ['verifications', 'reasonings'],
        });

        return all.map((entity) => this.toDomain(entity));
    }

    async updateAfterVerification(params: {
        factId: string;
        newStatus: FactStatus;
        newCategory: FactCategory;
        newReasoning: { summary: string; content: string };
    }): Promise<void> {
        const fact = await this.repo.findOne({
            where: { id: params.factId },
            relations: ['reasonings'],
        });

        if (!fact) {
            this.logger.warn(`Fact no encontrado con id: ${params.factId}`);

            throw new NotFoundException(
                `No se encontró el Fact con id ${params.factId}`,
            );
        }

        const reasoning = new ReasoningOrmEntity();

        reasoning.summary = params.newReasoning.summary;
        reasoning.content = params.newReasoning.content;
        reasoning.fact = fact;

        fact.status = params.newStatus;
        fact.category = params.newCategory;

        await this.repo.save(fact);
        await this.repo.manager.save(reasoning);
    }

    async updateStatusAndCategory(params: {
        factId: string;
        newStatus: FactStatus;
        newCategory: FactCategory;
    }): Promise<void> {
        const fact = await this.repo.findOneBy({ id: params.factId });

        if (!fact) {
            this.logger.warn(`Fact no encontrado con id: ${params.factId}`);

            throw new NotFoundException(
                `No se encontró el Fact con id ${params.factId}`,
            );
        }

        fact.status = params.newStatus;
        fact.category = params.newCategory;

        await this.repo.save(fact);
    }

    private toOrm(domain: Fact): FactOrmEntity {
        const entity = new FactOrmEntity();

        entity.id = domain.getId();
        entity.status = domain.getStatus();
        entity.category = domain.getCategory();
        entity.createdAt = domain.getCreatedAt();
        entity.updatedAt = domain.getUpdatedAt();

        return entity;
    }

    private toDomain(entity: FactOrmEntity): Fact {
        const reasonings = (entity.reasonings ?? []).map(toDomainReasoning);
        const verifications = (entity.verifications ?? []).map(
            toDomainVerification,
        );

        return new Fact(
            entity.id,
            entity.status,
            entity.category,
            entity.createdAt,
            entity.updatedAt,
            verifications,
            reasonings,
            [],
        );
    }
}
