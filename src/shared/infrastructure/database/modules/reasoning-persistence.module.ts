import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReasoningOrmEntity } from '../../entities/reasoning.orm-entity';
import { ReasoningRepository } from '../../repositories/reasoning.repository';

import { ReasoningRepositoryToken } from '@/shared/tokens/reasoning-repository.token';

@Module({
    imports: [TypeOrmModule.forFeature([ReasoningOrmEntity])],
    providers: [
        {
            provide: ReasoningRepositoryToken,
            useClass: ReasoningRepository,
        },
    ],
    exports: [ReasoningRepositoryToken],
})
export class ReasoningPersistenceModule {}
