import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { ValidatorCommandHandlers } from './application/commands';
import { ValidatorQueryHandlers } from './application/queries';
import { VerifyClaimOrchestratorService } from './application/services/verify-claim-orchestrator.service';
import { ValidatorReadUseCases } from './application/use-cases/read';
import { ValidatorWriteUseCases } from './application/use-cases/write';
import { ValidatorAgentController } from './presentation/rest/controllers/validator-agent.controllers';

import {
    GetFactByIdHandler,
    GetVerificationByIdHandler,
} from '@/shared/application/queries';
import {
    GetFactByIdUseCase,
    GetVerificationByIdUseCase,
} from '@/shared/application/use-cases/read';
import { EventBusModule } from '@/shared/event-bus/event-bus.module';
import { FactualVerificationResultModule } from '@/shared/event-handlers/factual-verification-result.module';
import {
    FactPersistenceModule,
    FindingPersistenceModule,
    VerificationPersistenceModule,
} from '@/shared/infrastructure/database/modules';
import { ReasoningPersistenceModule } from '@/shared/infrastructure/database/modules/reasoning-persistence.module';
import { LlmModule } from '@/shared/llm/llm.module';

@Module({
    imports: [
        CqrsModule,
        FactPersistenceModule,
        FindingPersistenceModule,
        ReasoningPersistenceModule,
        VerificationPersistenceModule,
        LlmModule,
        EventBusModule,
        FactualVerificationResultModule,
    ],
    controllers: [ValidatorAgentController],
    providers: [
        ...ValidatorCommandHandlers,
        ...ValidatorQueryHandlers,
        ...ValidatorWriteUseCases,
        ...ValidatorReadUseCases,
        GetFactByIdHandler,
        GetVerificationByIdHandler,
        GetFactByIdUseCase,
        GetVerificationByIdUseCase,
        VerifyClaimOrchestratorService,
    ],
})
export class ValidatorAgentModule {}
