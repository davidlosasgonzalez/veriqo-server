import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat';

@Injectable()
export class OpenAIChatService {
    private openai: OpenAI;

    constructor() {
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            throw new Error(
                'No se encontró la clave API de OpenAI. Verifica el archivo .env.',
            );
        }

        this.openai = new OpenAI({
            apiKey,
        });
    }

    // NUEVO: acepta múltiples mensajes estructurados
    async chat(
        messages: ChatCompletionMessageParam[],
        model: string = 'gpt-4o',
    ): Promise<string> {
        const response = await this.openai.chat.completions.create({
            model,
            messages,
        });

        const content = response.choices[0]?.message?.content;

        if (!content) {
            throw new Error('No se recibió contenido de la respuesta.');
        }

        return content;
    }
}
