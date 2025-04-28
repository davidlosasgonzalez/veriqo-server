import { Injectable } from '@nestjs/common';
import { ClaudeChatService } from './claude-chat.service';
import { OpenAiChatService } from './openai-chat.service';
import {
    LlmMessage,
    ClaudeMessage,
} from '@/shared/types/parsed-types/llm-message.type';

/**
 * Servicio que enruta mensajes a OpenAI o Claude según el proveedor definido.
 */
@Injectable()
export class LlmRouterService {
    constructor(
        private readonly openai: OpenAiChatService,
        private readonly claude: ClaudeChatService,
    ) {}

    /**
     * Enruta mensajes a OpenAI o Claude según el proveedor definido.
     *
     * @param messages - Lista de mensajes.
     * @param provider - El proveedor de LLM (OpenAI o Claude).
     * @returns Respuesta generada por el modelo elegido.
     */
    async chat(messages: LlmMessage[], provider: string): Promise<string> {
        if (provider === 'claude') {
            const claudeMessages: ClaudeMessage[] = messages.filter(
                (msg): msg is ClaudeMessage =>
                    msg.role === 'user' || msg.role === 'assistant',
            );

            return await this.claude.chat(claudeMessages);
        }

        return await this.openai.chat(messages);
    }
}
