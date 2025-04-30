import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FactCheckerAgentController } from './fact-checker-agent.controller';
import { FactCheckerAgentService } from './fact-checker-agent.service';
import { AgentReasoningRepositoryToken } from '@/application/tokens/agent-reasoning-repository.token';
import { UpdateAgentFactAfterVerificationUseCaseWrite } from '@/application/use-cases/write/update-agent-fact-after-verification.use-case.write';
import { VerifyFactUseCaseWrite } from '@/application/use-cases/write/verify-fact.use-case.write';
import { AgentFactPersistenceModule } from '@/infrastructure/database/agent-fact-persistence.module';
import { AgentFindingPersistenceModule } from '@/infrastructure/database/agent-finding-persistence.module';
import { AgentReasoningPersistenceModule } from '@/infrastructure/database/agent-reasoning-persistence.module';
import { AgentVerificationPersistenceModule } from '@/infrastructure/database/agent-verification-persistence.module';
import { AgentFactEntity } from '@/infrastructure/database/typeorm/entities/agent-fact.entity';
import { AgentFindingEntity } from '@/infrastructure/database/typeorm/entities/agent-finding.entity';
import { AgentPromptEntity } from '@/infrastructure/database/typeorm/entities/agent-prompt.entity';
import { AgentReasoningEntity } from '@/infrastructure/database/typeorm/entities/agent-reasoning.entity';
import { AgentVerificationEntity } from '@/infrastructure/database/typeorm/entities/agent-verification.entity';
import { AgentReasoningRepository } from '@/infrastructure/database/typeorm/repositories/agent-reasoning.repository';
import { AgentVerificationRepository } from '@/infrastructure/database/typeorm/repositories/agent-verification.repository';
import { EventBusModule } from '@/shared/event-bus/event-bus.module';
import { LlmModule } from '@/shared/llm/llm.module';
import { AgentPromptService } from '@/shared/llm/services/agent-prompt.service';
import { SearchModule } from '@/shared/search/search.module';

/**
 * Módulo del agente FactChecker.
 */
@Module({
    imports: [
        AgentFactPersistenceModule,
        AgentFindingPersistenceModule,
        AgentVerificationPersistenceModule,
        AgentReasoningPersistenceModule,
        EventBusModule,
        SearchModule,
        LlmModule,
        TypeOrmModule.forFeature([
            AgentPromptEntity,
            AgentVerificationEntity,
            AgentReasoningEntity,
            AgentFactEntity,
            AgentFindingEntity,
        ]),
    ],
    controllers: [FactCheckerAgentController],
    providers: [
        FactCheckerAgentService,
        VerifyFactUseCaseWrite,
        UpdateAgentFactAfterVerificationUseCaseWrite,
        AgentVerificationRepository,
        AgentPromptService,
        {
            provide: AgentReasoningRepositoryToken,
            useClass: AgentReasoningRepository,
        },
    ],
    exports: [FactCheckerAgentService],
})
export class FactCheckerAgentModule {}
