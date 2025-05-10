import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateFindingSearchContextCommand } from '../../../commands/finding/create-finding-search-context.command';

import { FindingSearchContext } from '@/agents/validator-agent/domain/entities/finding-search-context';
import { FindingSearchContextOrmEntity } from '@/agents/validator-agent/infrastructure/entities/finding-search-context.orm-entity';
import { FindingOrmEntity } from '@/agents/validator-agent/infrastructure/entities/finding.orm-entity';

@Injectable()
export class CreateFindingSearchContextUseCase {
    constructor(
        @InjectRepository(FindingOrmEntity)
        private readonly findingRepo: Repository<FindingOrmEntity>,
    ) {}

    async execute(
        command: CreateFindingSearchContextCommand,
    ): Promise<FindingSearchContext> {
        const now = new Date();
        const findingEntity = await this.findingRepo.findOne({
            where: { id: command.payload.findingId },
        });

        if (!findingEntity) {
            throw new Error(
                `No se encontró ningún Finding con ID ${command.payload.findingId}`,
            );
        }

        const contextEntity = new FindingSearchContextOrmEntity();

        contextEntity.finding = findingEntity;
        contextEntity.searchQuery = command.payload.searchQuery;
        contextEntity.siteSuggestions = command.payload.siteSuggestions ?? null;
        contextEntity.createdAt = now;
        contextEntity.updatedAt = now;

        const savedContext = await this.findingRepo.manager.save(contextEntity);

        return new FindingSearchContext(
            savedContext.id,
            savedContext.searchQuery,
            savedContext.createdAt,
            savedContext.updatedAt,
            savedContext.finding.id,
            savedContext.siteSuggestions,
        );
    }
}
