import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateFindingSearchContextUseCase } from '@/agents/validator-agent/application/use-cases/write/finding/create-finding-search-context.use-case';
import { FindingSearchContextOrmEntity } from '@/agents/validator-agent/infrastructure/entities/finding-search-context.orm-entity';
import { FindingOrmEntity } from '@/agents/validator-agent/infrastructure/entities/finding.orm-entity';
import { FindingRepository } from '@/agents/validator-agent/infrastructure/repositories/finding.repository';
import { FindingRepositoryToken } from '@/shared/tokens/finding-repository.token';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            FindingOrmEntity,
            FindingSearchContextOrmEntity,
        ]),
    ],
    providers: [
        {
            provide: FindingRepositoryToken,
            useClass: FindingRepository,
        },
        CreateFindingSearchContextUseCase,
    ],
    exports: [FindingRepositoryToken, CreateFindingSearchContextUseCase],
})
export class FindingPersistenceModule {}
