import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AgentLogOrmEntity } from '../infrastructure/entities/agent-log.orm-entity';
import { AgentPromptOrmEntity } from '../infrastructure/entities/agent-prompt.orm-entity';

import { AgentLogService } from './services/agent-log.service';
import { AgentPromptService } from './services/agent-prompt.service';
import { ClaudeChatService } from './services/claude-chat.service';
import { LlmRouterService } from './services/llm-router.service';
import { OpenAiChatService } from './services/openai-chat.service';
import { OpenAiEmbeddingService } from './services/openai-embedding.service';

import { EmbeddingServiceToken } from '@/shared/tokens/embedding-service.token';

@Module({
    imports: [
        TypeOrmModule.forFeature([AgentPromptOrmEntity, AgentLogOrmEntity]),
    ],
    providers: [
        OpenAiChatService,
        ClaudeChatService,
        LlmRouterService,
        AgentPromptService,
        AgentLogService,
        {
            provide: EmbeddingServiceToken,
            useClass: OpenAiEmbeddingService,
        },
    ],
    exports: [
        LlmRouterService,
        AgentPromptService,
        AgentLogService,
        EmbeddingServiceToken,
    ],
})
export class LlmModule {}
