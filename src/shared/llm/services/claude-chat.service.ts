import Anthropic from '@anthropic-ai/sdk';
import { Injectable } from '@nestjs/common';
import { env } from '@/config/env/env.config';
import { ClaudeMessage } from '@/shared/types/parsed-types/llm-message.type';
import { countTokens } from '@/shared/utils/llm/count-tokens';
import { mapToTiktokenModel } from '@/shared/utils/llm/map-to-tiktoken-model';

/**
 * Servicio para interactuar con Claude usando la API de Anthropic.
 */
@Injectable()
export class ClaudeChatService {
    private readonly anthropic = new Anthropic({ apiKey: env.CLAUDE_API_KEY });

    /**
     * Envía mensajes a Claude y devuelve la respuesta generada junto con métricas de tokens.
     *
     * @param messages - Lista de mensajes para enviar a Claude.
     * @returns Contenido generado, tokens de entrada, tokens de salida, modelo usado.
     */
    async chat(messages: ClaudeMessage[]): Promise<{
        rawOutput: string;
        inputTokens: number;
        outputTokens: number;
        model: string;
    }> {
        const model = env.LLM_VALIDATOR_MODEL;
        const inputText = messages.map((m) => m.content).join(' ');
        const inputTokens = countTokens(inputText, mapToTiktokenModel(model));
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

        const rawOutput = textBlock.text;
        const outputTokens = countTokens(rawOutput, mapToTiktokenModel(model));

        return { rawOutput, inputTokens, outputTokens, model };
    }
}
