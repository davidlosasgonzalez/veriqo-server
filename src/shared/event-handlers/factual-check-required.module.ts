import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { EventBusModule } from '../event-bus/event-bus.module';
import { VerificationPersistenceModule } from '../infrastructure/database/modules';
import { ReasoningPersistenceModule } from '../infrastructure/database/modules/reasoning-persistence.module';
import { LlmModule } from '../llm/llm.module';
import { SearchModule } from '../search/search.module';

import { VerifyFactUseCase } from '@/agents/fact-checker/application/use-cases/write/fact/verify-fact.use-case';
import { FactualCheckRequiredHandler } from '@/shared/events/handlers/factual-check-required.handler';

@Module({
    imports: [
        CqrsModule,
        SearchModule,
        LlmModule,
        EventBusModule,
        ReasoningPersistenceModule,
        VerificationPersistenceModule,
    ],
    providers: [FactualCheckRequiredHandler, VerifyFactUseCase],
})
export class FactualCheckRequiredModule {}
