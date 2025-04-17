import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { OpenAI } from 'openai';
import {
    ChatCompletionMessageParam,
    ChatCompletionCreateParams,
} from 'openai/resources/chat';
import { env } from '@/config/env/env.config';

@Injectable()
export class OpenAIChatService {
    private readonly openai: OpenAI;
    private readonly logger = new Logger(OpenAIChatService.name);

    constructor() {
        const apiKey = env.OPENAI_API_KEY;

        if (!apiKey) {
            throw new Error(
                'OPENAI_API_KEY no está definido. Revisa tu archivo .env',
            );
        }

        this.openai = new OpenAI({ apiKey });
    }

    /**
     * Envía un array de mensajes al modelo OpenAI y devuelve la respuesta.
     * @param messages - Mensajes en formato ChatML
     * @param model - Modelo OpenAI a usar (por defecto: gpt-4o)
     */
    async chat(
        messages: ChatCompletionMessageParam[],
        model: string = 'gpt-4o',
    ): Promise<string> {
        try {
            const params: ChatCompletionCreateParams = {
                model,
                messages,
            };

            const response = await this.openai.chat.completions.create(params);
            const content = response.choices[0]?.message?.content;

            if (!content) {
                this.logger.warn(
                    `OpenAI no devolvió contenido para model=${model}`,
                );
                throw new InternalServerErrorException(
                    'OpenAI respondió sin contenido. Inténtalo de nuevo.',
                );
            }

            return content;
        } catch (err) {
            this.logger.error(
                `Error al llamar a OpenAI [${model}]: ${err.message}`,
                err.stack,
            );
            throw new InternalServerErrorException(
                'Error al procesar la respuesta de OpenAI.',
            );
        }
    }
}
