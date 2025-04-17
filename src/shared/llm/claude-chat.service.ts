import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ChatCompletionMessageParam } from 'openai/resources/chat';
import { env } from '@/config/env/env.config';

@Injectable()
export class ClaudeChatService {
    private readonly API_URL = 'https://api.anthropic.com/v1/messages';
    private readonly DEFAULT_MODEL = 'claude-3-5-sonnet-20241022';
    private readonly logger = new Logger(ClaudeChatService.name);
    private readonly headers: Record<string, string>;

    constructor() {
        const apiKey = env.CLAUDE_API_KEY;

        if (!apiKey) {
            throw new Error('Falta CLAUDE_API_KEY en el archivo .env');
        }

        this.headers = {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
        };
    }

    /**
     * Llama al modelo Claude con un mensaje de usuario y otro de sistema.
     * @param messages Lista de mensajes con roles system y user.
     * @param modelOverride Modelo a usar (por defecto: Claude Sonnet 3.5).
     * @returns Contenido textual generado por Claude.
     */
    async chat(
        messages: ChatCompletionMessageParam[],
        modelOverride?: string,
    ): Promise<string> {
        const model = modelOverride || this.DEFAULT_MODEL;
        const userMessage = messages.find((m) => m.role === 'user');
        const systemMessage = messages.find((m) => m.role === 'system');

        if (!userMessage || !systemMessage) {
            throw new Error(
                'Claude requiere mensajes con roles "system" y "user" definidos.',
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
                                    text: userMessage.content ?? '',
                                },
                            ],
                        },
                    ],
                },
                { headers: this.headers },
            );

            const content =
                response.data?.content?.[0]?.text || response.data?.content;

            if (!content || typeof content !== 'string') {
                this.logger.warn(
                    `Claude respondió sin contenido válido. Respuesta: ${JSON.stringify(
                        response.data,
                    )}`,
                );
                throw new Error('Respuesta vacía o mal formada de Claude.');
            }

            return content;
        } catch (error: any) {
            if (
                error.response?.status === 404 &&
                error.response?.data?.error?.type === 'not_found_error'
            ) {
                this.logger.error(
                    `Modelo '${model}' no encontrado. Verifica que esté disponible en tu cuenta Anthropic.`,
                );
            }

            this.logger.error(
                `Error en Claude API: ${error.message}`,
                error.stack,
            );
            throw error;
        }
    }
}
