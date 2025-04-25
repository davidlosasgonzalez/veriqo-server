import { Injectable } from '@nestjs/common';
import { ClaudeChatService } from './claude-chat.service';
import { OpenAiChatService } from './openai-chat.service';
import { env } from '@/config/env/env.config';
import { LlmMessage, ClaudeMessage } from '@/shared/types/llm-message.type';

@Injectable()
export class LlmRouterService {
    constructor(
        private readonly openai: OpenAiChatService,
        private readonly claude: ClaudeChatService,
    ) {}

    /**
     * Enruta mensajes a OpenAI o Claude según el proveedor definido.
     */
    async chat(messages: LlmMessage[], model?: string): Promise<string> {
        const provider = env.LLM_PROVIDER || 'openai';

        if (provider === 'claude') {
            const claudeMessages: ClaudeMessage[] = messages.filter(
                (msg): msg is ClaudeMessage =>
                    msg.role === 'user' || msg.role === 'assistant',
            );

            return await this.claude.chat(claudeMessages, model);
        }

        return await this.openai.chat(messages, model);
    }
}
