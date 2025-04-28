import Anthropic from '@anthropic-ai/sdk';
import { Injectable } from '@nestjs/common';
import { env } from '@/config/env/env.config';
import { ClaudeMessage } from '@/shared/types/parsed-types/llm-message.type';

/**
 * Servicio para interactuar con Claude usando la API de Anthropic.
 */
@Injectable()
export class ClaudeChatService {
    private readonly anthropic = new Anthropic({ apiKey: env.CLAUDE_API_KEY });

    /**
     * Envía mensajes a Claude y devuelve la respuesta generada.
     *
     * @param messages - Lista de mensajes para enviar a Claude.
     * @returns La respuesta generada por Claude.
     */
    async chat(messages: ClaudeMessage[]): Promise<string> {
        const res = await this.anthropic.messages.create({
            model: env.VALIDATOR_MODEL,
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
