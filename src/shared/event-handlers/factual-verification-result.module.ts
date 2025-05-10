import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FactualVerificationResultHandler } from '@/shared/events/handlers/factual-verification-result.handler';
import { FactPersistenceModule } from '@/shared/infrastructure/database/modules';
import { ReasoningOrmEntity } from '@/shared/infrastructure/entities/reasoning.orm-entity';
import { ReasoningRepository } from '@/shared/infrastructure/repositories/reasoning.repository';
import { ReasoningRepositoryToken } from '@/shared/tokens/reasoning-repository.token';

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([ReasoningOrmEntity]),
        FactPersistenceModule,
    ],
    providers: [
        FactualVerificationResultHandler,
        {
            provide: ReasoningRepositoryToken,
            useClass: ReasoningRepository,
        },
    ],
})
export class FactualVerificationResultModule {}
