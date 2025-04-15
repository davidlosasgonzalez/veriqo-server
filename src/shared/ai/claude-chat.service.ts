import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ChatCompletionMessageParam } from 'openai/resources/chat';
import { env } from '@/config/env/env.config';

@Injectable()
export class ClaudeChatService {
    private readonly API_URL = 'https://api.anthropic.com/v1/messages';
    private readonly API_KEY = env.CLAUDE_API_KEY;

    // ✅ Modelo actualizado y válido
    private readonly DEFAULT_MODEL = 'claude-3-5-sonnet-20241022';

    private readonly HEADERS = {
        'x-api-key': this.API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
    };

    async chat(
        messages: ChatCompletionMessageParam[],
        modelOverride?: string,
    ): Promise<string> {
        const model = modelOverride || this.DEFAULT_MODEL;

        const userMessage = messages.find((m) => m.role === 'user');
        const systemMessage = messages.find((m) => m.role === 'system');

        if (!userMessage || !systemMessage) {
            throw new Error(
                'Claude requiere mensajes con role user y system por separado.',
            );
        }

        try {
            const response = await axios.post(
                this.API_URL,
                {
                    model,
                    max_tokens: 1000,
                    temperature: 0.3,
                    system: systemMessage.content,
                    messages: [
                        {
                            role: 'user',
                            content: [
                                {
                                    type: 'text',
                                    text: userMessage.content || '',
                                },
                            ],
                        },
                    ],
                },
                { headers: this.HEADERS },
            );

            const content =
                response.data?.content?.[0]?.text || response.data?.content;

            if (!content || typeof content !== 'string') {
                throw new Error(
                    `Claude no devolvió contenido válido. Respuesta: ${JSON.stringify(
                        response.data,
                        null,
                        2,
                    )}`,
                );
            }

            return content;
        } catch (error: any) {
            if (
                error.response?.status === 404 &&
                error.response?.data?.error?.type === 'not_found_error'
            ) {
                console.error(
                    `❌ Modelo '${model}' no encontrado. Por favor, verifica el nombre del modelo Claude.`,
                );
            }

            throw error;
        }
    }
}
