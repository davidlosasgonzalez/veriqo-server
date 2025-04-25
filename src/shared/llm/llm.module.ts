import { Module } from '@nestjs/common';
import { ClaudeChatService } from './services/claude-chat.service';
import { LlmRouterService } from './services/llm-router.service';
import { OpenAiChatService } from './services/openai-chat.service';

/**
 * Módulo compartido que agrupa los servicios de acceso a modelos LLM (OpenAI, Claude).
 */
@Module({
    providers: [OpenAiChatService, ClaudeChatService, LlmRouterService],
    exports: [LlmRouterService],
})
export class LlmModule {}
