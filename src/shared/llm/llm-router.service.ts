import { Injectable } from '@nestjs/common';
import { ChatCompletionMessageParam } from 'openai/resources/chat';
import { ClaudeChatService } from './claude-chat.service';
import { OpenAIChatService } from './openai-chat.service';
import { ClaudeEmbeddingService } from '../embeddings/claude-embedding.service';
import { OpenAIEmbeddingService } from '../embeddings/openai-embedding.service';
import { env } from '@/config/env/env.config';

@Injectable()
export class LlmRouterService {
    constructor(
        private readonly claude: ClaudeChatService,
        private readonly openai: OpenAIChatService,
        private readonly openaiEmbedding: OpenAIEmbeddingService,
        private readonly claudeEmbedding: ClaudeEmbeddingService,
    ) {}

    /**
     * Encamina la petición de chat al modelo configurado para el agente.
     *
     * @param agent Nombre del agente (`validator` o `factchecker`)
     * @param messages Conversación con roles `system` y `user`
     * @returns Contenido textual generado por el modelo
     */
    async chatWithAgent(
        agent: 'validator' | 'factchecker',
        messages: ChatCompletionMessageParam[],
    ): Promise<string> {
        const model =
            agent === 'validator' ? env.VALIDATOR_MODEL : env.FACTCHECKER_MODEL;

        if (!model) {
            throw new Error(
                `No se ha definido un modelo para el agente "${agent}"`,
            );
        }

        if (model.startsWith('claude')) {
            return this.claude.chat(messages, model);
        }

        return this.openai.chat(messages, model);
    }

    /**
     * Genera un embedding numérico a partir de texto, usando el proveedor configurado.
     *
     * @param text Texto a convertir
     * @param model Modelo de embedding (por defecto: 'text-embedding-3-small')
     * @returns Vector de embedding (array de floats)
     */
    async embed(
        text: string,
        model: string = 'text-embedding-3-small',
    ): Promise<number[]> {
        const provider = env.EMBEDDING_MODEL_PROVIDER || 'openai';

        if (provider === 'openai') {
            if (!model.startsWith('text-embedding')) {
                throw new Error(
                    `Modelo de embedding no soportado: ${model}. Usa 'text-embedding-3-small'.`,
                );
            }
            return this.openaiEmbedding.generateEmbedding(text, model);
        }

        if (provider === 'claude') {
            return this.claudeEmbedding.getEmbedding(text);
        }

        throw new Error(
            `Proveedor de embedding no soportado: ${provider}. Usa 'openai' o 'claude'.`,
        );
    }
}
