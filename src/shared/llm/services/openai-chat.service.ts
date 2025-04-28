import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { env } from '@/config/env/env.config';
import { LlmMessage } from '@/shared/types/parsed-types/llm-message.type';

/**
 * Servicio para interactuar con OpenAI usando la API oficial de OpenAI.
 */
@Injectable()
export class OpenAiChatService {
    private readonly client = new OpenAI({ apiKey: env.OPENAI_API_KEY });

    /**
     * Envia mensajes a OpenAI y obtiene la respuesta generada.
     *
     * @param messages - Lista de mensajes para enviar a OpenAI.
     * @returns La respuesta generada por OpenAI.
     */
    async chat(messages: LlmMessage[]): Promise<string> {
        const response = await this.client.chat.completions.create({
            model: env.FACTCHECKER_MODEL,
            messages,
        });

        return response.choices[0]?.message?.content ?? '';
    }
}
