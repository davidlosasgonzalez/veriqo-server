import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VerifyClaimController } from './controller/verify-claim.controller';
import { VerifyClaimService } from './services/verify-claim.service';

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
import { VerifyClaimUseCaseWrite } from '@/application/use-cases/write/verify-claim.use-case.write';

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

import { LlmModule } from '@/shared/llm/llm.module';
import { ClaudeChatService } from '@/shared/llm/services/claude-chat.service';
import { LlmRouterService } from '@/shared/llm/services/llm-router.service';
import { OpenAiChatService } from '@/shared/llm/services/openai-chat.service';
import { OpenAiEmbeddingService } from '@/shared/llm/services/openai-embedding.service';

@Module({
    imports: [
        AgentFactPersistenceModule,
        AgentFindingPersistenceModule,
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
    controllers: [VerifyClaimController],
    providers: [
        // Servicios principales.
        LlmRouterService,
        OpenAiChatService,
        ClaudeChatService,
        VerifyClaimService,
        VerifyClaimUseCaseWrite,

        // Casos de uso READ.
        NormalizeClaimsUseCaseRead,
        AnalyzeTextUseCaseRead,
        FindFactByFindingClaimUseCaseRead,

        // Casos de uso WRITE.
        AnalyzeTextUseCaseWrite,
        CreateAgentFactUseCaseWrite,
        CreateAgentFindingUseCaseWrite,
        CreateAgentReasoningUseCaseWrite,
        CreateAgentFindingSearchContextUseCaseWrite,

        // Repositorios.
        AgentFactRepository,
        AgentFindingRepository,
        AgentFindingSearchContextRepository,

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
