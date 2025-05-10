import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommandHandlers } from './application/commands';
import { WriteUseCases } from './application/use-cases/write';
import { VerifyFactUseCase } from './application/use-cases/write/fact/verify-fact.use-case';
import { FactCheckerAgentController } from './presentation/rest/controllers/fact-checker-agent.controller';

import { EventBusModule } from '@/shared/event-bus/event-bus.module';
import { FactualCheckRequiredModule } from '@/shared/event-handlers/factual-check-required.module';
import {
    FactPersistenceModule,
    VerificationPersistenceModule,
} from '@/shared/infrastructure/database/modules';
import { AgentPromptOrmEntity } from '@/shared/infrastructure/entities/agent-prompt.orm-entity';
import { FactOrmEntity } from '@/shared/infrastructure/entities/fact.orm-entity';
import { ReasoningOrmEntity } from '@/shared/infrastructure/entities/reasoning.orm-entity';
import { VerificationOrmEntity } from '@/shared/infrastructure/entities/verification.orm-entity';
import { ReasoningRepository } from '@/shared/infrastructure/repositories/reasoning.repository';
import { VerificationRepository } from '@/shared/infrastructure/repositories/verification.repository';
import { LlmModule } from '@/shared/llm/llm.module';
import { SearchModule } from '@/shared/search/search.module';
import { ReasoningRepositoryToken } from '@/shared/tokens/reasoning-repository.token';

@Module({
    imports: [
        CqrsModule,
        EventBusModule,
        LlmModule,
        SearchModule,
        FactPersistenceModule,
        VerificationPersistenceModule,
        FactualCheckRequiredModule,
        TypeOrmModule.forFeature([
            VerificationOrmEntity,
            ReasoningOrmEntity,
            FactOrmEntity,
        ]),
    ],
    controllers: [FactCheckerAgentController],
    providers: [
        ...CommandHandlers,
        ...WriteUseCases,
        VerifyFactUseCase,
        VerificationRepository,
        {
            provide: ReasoningRepositoryToken,
            useClass: ReasoningRepository,
        },
    ],
})
export class FactCheckerAgentModule {}
