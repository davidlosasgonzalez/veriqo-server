import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClaudeChatService } from './services/claude-chat.service';
import { LlmRouterService } from './services/llm-router.service';
import { OpenAiChatService } from './services/openai-chat.service';
import { PromptService } from './services/prompt.service';
import { AgentPromptEntity } from '@/infrastructure/database/typeorm/entities/agent-prompt.entity';

/**
 * Módulo compartido que agrupa los servicios de acceso a modelos LLM (OpenAI, Claude).
 */
@Module({
    imports: [TypeOrmModule.forFeature([AgentPromptEntity])],
    providers: [
        OpenAiChatService,
        OpenAiChatService,
        ClaudeChatService,
        LlmRouterService,
        PromptService,
    ],
    exports: [LlmRouterService],
})
export class LlmModule {}
