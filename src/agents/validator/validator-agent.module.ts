import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidatorAgentController } from './validator-agent.controller';
import { ValidatorAgentService } from './validator-agent.service';
import { ValidatorOrchestratorService } from '@/application/services/validator/validator-orchestratos.service';
import { AgentFactRepositoryToken } from '@/application/tokens/agent-fact-repository.token';
import { AgentFindingRepositoryToken } from '@/application/tokens/agent-finding-repository.token';
import { AgentFindingSearchContextRepositoryToken } from '@/application/tokens/agent-finding-search-context.token';
import { EmbeddingServiceToken } from '@/application/tokens/embedding.token';
import { AnalyzeTextUseCaseRead } from '@/application/use-cases/read/analyze-text.use-case.read';
import { FindFactByFindingClaimUseCaseRead } from '@/application/use-cases/read/find-fact-by-finding-claim.use-case.read';
import { NormalizeClaimsUseCaseRead } from '@/application/use-cases/read/normalized-claims.use-case.read';
import { AnalyzeTextUseCaseWrite } from '@/application/use-cases/write/analyze-text.use-case.write';
import { CreateAgentFactUseCaseWrite } from '@/application/use-cases/write/create-agent-fact.use-case.write';
import { CreateAgentFindingSearchContextUseCaseWrite } from '@/application/use-cases/write/create-agent-finding-search-context.use-case.write';
import { CreateAgentFindingUseCaseWrite } from '@/application/use-cases/write/create-agent-finding.use-case.write';
import { CreateAgentReasoningUseCaseWrite } from '@/application/use-cases/write/create-agent-reasoning.use-case.write';
import { UpdateAgentFactAfterVerificationUseCaseWrite } from '@/application/use-cases/write/update-agent-fact-after-verification.use-case.write';
import { VerifyFactUseCaseWrite } from '@/application/use-cases/write/verify-fact.use-case.write';
import { AgentFactPersistenceModule } from '@/infrastructure/database/agent-fact-persistence.module';
import { AgentFindingPersistenceModule } from '@/infrastructure/database/agent-finding-persistence.module';
import { AgentFactEntity } from '@/infrastructure/database/typeorm/entities/agent-fact.entity';
import { AgentFindingSearchContextEntity } from '@/infrastructure/database/typeorm/entities/agent-finding-search-context.entity';
import { AgentFindingEntity } from '@/infrastructure/database/typeorm/entities/agent-finding.entity';
import { AgentPromptEntity } from '@/infrastructure/database/typeorm/entities/agent-prompt.entity';
import { AgentReasoningEntity } from '@/infrastructure/database/typeorm/entities/agent-reasoning.entity';
import { AgentVerificationEntity } from '@/infrastructure/database/typeorm/entities/agent-verification.entity';
import { AgentFactRepository } from '@/infrastructure/database/typeorm/repositories/agent-fact.repository';
import { AgentFindingSearchContextRepository } from '@/infrastructure/database/typeorm/repositories/agent-finding-search-context.repository';
import { AgentFindingRepository } from '@/infrastructure/database/typeorm/repositories/agent-finding.repository';
import { AgentVerificationRepository } from '@/infrastructure/database/typeorm/repositories/agent-verification.repository';
import { EventBusModule } from '@/shared/event-bus/event-bus.module';
import { LlmModule } from '@/shared/llm/llm.module';
import { OpenAiEmbeddingService } from '@/shared/llm/services/openai-embedding.service';
import { PromptService } from '@/shared/llm/services/prompt.service';
import { SearchModule } from '@/shared/search/search.module';

/**
 * Módulo del agente Validator.
 */
@Module({
    imports: [
        AgentFactPersistenceModule,
        AgentFindingPersistenceModule,
        EventBusModule,
        SearchModule,
        LlmModule,
        TypeOrmModule.forFeature([
            AgentPromptEntity,
            AgentFactEntity,
            AgentFindingEntity,
            AgentFindingSearchContextEntity,
            AgentVerificationEntity,
            AgentReasoningEntity,
        ]),
    ],
    controllers: [ValidatorAgentController],
    providers: [
        // Servicios principales
        ValidatorAgentService,
        ValidatorOrchestratorService,
        PromptService,

        // Casos de uso READ
        NormalizeClaimsUseCaseRead,
        AnalyzeTextUseCaseRead,
        FindFactByFindingClaimUseCaseRead,

        // Casos de uso WRITE
        AnalyzeTextUseCaseWrite,
        CreateAgentFactUseCaseWrite,
        CreateAgentFindingUseCaseWrite,
        CreateAgentReasoningUseCaseWrite,
        CreateAgentFindingSearchContextUseCaseWrite,
        UpdateAgentFactAfterVerificationUseCaseWrite,
        VerifyFactUseCaseWrite,

        // Repositorios
        AgentFactRepository,
        AgentFindingRepository,
        AgentFindingSearchContextRepository,
        AgentVerificationRepository,

        {
            provide: EmbeddingServiceToken,
            useClass: OpenAiEmbeddingService,
        },
        {
            provide: AgentFindingRepositoryToken,
            useClass: AgentFindingRepository,
        },
        {
            provide: AgentFindingSearchContextRepositoryToken,
            useClass: AgentFindingSearchContextRepository,
        },
        {
            provide: AgentFactRepositoryToken,
            useClass: AgentFactRepository,
        },
    ],
})
export class ValidatorAgentModule {}
