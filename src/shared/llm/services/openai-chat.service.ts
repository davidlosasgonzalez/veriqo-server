import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { env } from '@/config/env/env.config';
import { LlmMessage } from '@/shared/types/parsed-types/llm-message.type';
import { countTokens } from '@/shared/utils/llm/count-tokens';
import { mapToTiktokenModel } from '@/shared/utils/llm/map-to-tiktoken-model';

/**
 * Servicio para interactuar con OpenAI usando la API oficial de OpenAI.
 */
@Injectable()
export class OpenAiChatService {
    private readonly client = new OpenAI({ apiKey: env.OPENAI_API_KEY });

    /**
     * Envia mensajes a OpenAI y obtiene la respuesta generada junto con métricas de tokens.
     *
     * @param messages - Lista de mensajes para enviar a OpenAI.
     * @returns Contenido generado, tokens de entrada, tokens de salida, modelo usado.
     */
    async chat(messages: LlmMessage[]): Promise<{
        rawOutput: string;
        inputTokens: number;
        outputTokens: number;
        model: string;
    }> {
        const model = env.LLM_FACTCHECKER_MODEL;
        const inputText = messages.map((msg) => msg.content).join(' ');
        const inputTokens = countTokens(inputText, mapToTiktokenModel(model));
        const response = await this.client.chat.completions.create({
            model,
            messages,
        });
        const rawOutput = response.choices[0]?.message?.content ?? '';
        const outputTokens = countTokens(rawOutput, mapToTiktokenModel(model));

        return { rawOutput, inputTokens, outputTokens, model };
    }
}
