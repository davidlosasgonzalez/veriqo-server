import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentLogService } from './services/agent-log.service';
import { AgentPromptService } from './services/agent-prompt.service';
import { ClaudeChatService } from './services/claude-chat.service';
import { LlmRouterService } from './services/llm-router.service';
import { OpenAiChatService } from './services/openai-chat.service';
import { AgentLogEntity } from '@/infrastructure/database/typeorm/entities/agent-log.entity';
import { AgentPromptEntity } from '@/infrastructure/database/typeorm/entities/agent-prompt.entity';

/**
 * Módulo compartido que agrupa los servicios de acceso a modelos LLM (OpenAI, Claude).
 */
@Module({
    imports: [TypeOrmModule.forFeature([AgentPromptEntity, AgentLogEntity])],
    providers: [
        OpenAiChatService,
        OpenAiChatService,
        ClaudeChatService,
        LlmRouterService,
        AgentPromptService,
        AgentLogService,
    ],
    exports: [LlmRouterService, AgentPromptService, AgentLogService],
})
export class LlmModule {}
