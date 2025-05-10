import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FactOrmEntity } from '../../entities/fact.orm-entity';
import { FactRepository } from '../../repositories/fact.repository';

import { FactRepositoryToken } from '@/shared/tokens/fact-repository.token';

@Module({
    imports: [TypeOrmModule.forFeature([FactOrmEntity])],
    providers: [
        {
            provide: FactRepositoryToken,
            useClass: FactRepository,
        },
    ],
    exports: [FactRepositoryToken],
})
export class FactPersistenceModule {}
