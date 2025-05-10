import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FindingSearchContext } from '../../domain/entities/finding-search-context';
import { FindingSearchContextOrmEntity } from '../entities/finding-search-context.orm-entity';
import { FindingOrmEntity } from '../entities/finding.orm-entity';

import { IFindingSearchContextRepository } from '@/shared/domain/interfaces/finding-search-context-repository.interface';

@Injectable()
export class FindingSearchContextRepository
    implements IFindingSearchContextRepository
{
    constructor(
        @InjectRepository(FindingSearchContextOrmEntity)
        private readonly repo: Repository<FindingSearchContextOrmEntity>,
    ) {}

    async save(context: FindingSearchContext): Promise<FindingSearchContext> {
        const entity = this.toOrmEntity(context);
        const saved = await this.repo.save(entity);

        return this.toDomainEntity(saved);
    }

    private toOrmEntity(
        domain: FindingSearchContext,
    ): FindingSearchContextOrmEntity {
        const entity = new FindingSearchContextOrmEntity();

        entity.id = domain.getId();
        entity.searchQuery = domain.getSearchQuery();
        entity.siteSuggestions = domain.getSiteSuggestions() ?? null;
        entity.createdAt = domain.getCreatedAt();
        entity.updatedAt = domain.getUpdatedAt();

        const findingId = domain.getFindingId();

        if (findingId) {
            const findingStub = new FindingOrmEntity();

            findingStub.id = findingId;
            entity.finding = findingStub;
        }

        return entity;
    }

    private toDomainEntity(
        entity: FindingSearchContextOrmEntity,
    ): FindingSearchContext {
        return new FindingSearchContext(
            entity.id,
            entity.searchQuery,
            entity.createdAt,
            entity.updatedAt,
            entity.findingId,
            entity.siteSuggestions,
        );
    }
}
