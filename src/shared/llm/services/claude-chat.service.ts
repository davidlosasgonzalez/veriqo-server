import Anthropic from '@anthropic-ai/sdk';
import { Injectable } from '@nestjs/common';
import { env } from '@/config/env/env.config';
import { ClaudeMessage } from '@/shared/types/llm-message.type';

@Injectable()
export class ClaudeChatService {
    private readonly anthropic = new Anthropic({ apiKey: env.CLAUDE_API_KEY });

    /**
     * Envía mensajes a Claude y devuelve la respuesta generada.
     */
    async chat(
        messages: ClaudeMessage[],
        model = env.VALIDATOR_MODEL,
    ): Promise<string> {
        const res = await this.anthropic.messages.create({
            model,
            max_tokens: 1024,
            messages,
        });
        const textBlock = res.content.find((block) => block.type === 'text') as
            | { type: 'text'; text: string }
            | undefined;

        if (!textBlock) {
            throw new Error(
                'Claude no devolvió ningún bloque de texto válido.',
            );
        }

        return textBlock.text;
    }
}
