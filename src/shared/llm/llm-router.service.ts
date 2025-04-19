import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ChatCompletionMessageParam } from 'openai/resources/chat';
import { ClaudeChatService } from './claude-chat.service';
import { OpenAIChatService } from './openai-chat.service';
import { ClaudeEmbeddingService } from '../embeddings/claude-embedding.service';
import { OpenAIEmbeddingService } from '../embeddings/openai-embedding.service';
import { AgentPromptService } from '../prompts/agent-prompt.service';
import { env } from '@/config/env/env.config';

@Injectable()
export class LlmRouterService {
    constructor(
        private readonly claude: ClaudeChatService,
        private readonly openai: OpenAIChatService,
        private readonly openaiEmbedding: OpenAIEmbeddingService,
        private readonly claudeEmbedding: ClaudeEmbeddingService,
        private readonly promptService: AgentPromptService,
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
     * Analiza un texto que puede contener múltiples afirmaciones, usando Claude
     * con prompt estructurado en bloques `system` y `user` separados por delimitadores.
     *
     * El prompt debe incluir las secciones `---SYSTEM---` y `---USER---` para separar
     * instrucciones globales del contenido dinámico.
     *
     * @param text Texto libre a analizar.
     * @returns JSON plano con findings generados por Claude.
     * @throws Error si el prompt no tiene el formato esperado.
     */
    async validateMultipleClaims(text: string): Promise<string> {
        const promptEntry = await this.promptService.getPrompt(
            'validator_agent',
            'VALIDATOR_ANALYZE_MULTICLAIM',
        );

        const rawPrompt = promptEntry.prompt;

        if (
            !rawPrompt.includes('---SYSTEM---') ||
            !rawPrompt.includes('---USER---')
        ) {
            throw new Error(
                `El prompt con key '${promptEntry.key}' no tiene el formato esperado con bloques '---SYSTEM---' y '---USER---'.`,
            );
        }

        const [_, promptBody] = rawPrompt.split('---SYSTEM---');
        const [systemBlock, userBlock] = promptBody.split('---USER---');

        const messages: ChatCompletionMessageParam[] = [
            {
                role: 'system',
                content: systemBlock.trim(),
            },
            {
                role: 'user',
                content: userBlock.replace('{{text}}', text).trim(),
            },
        ];

        const content = await this.claude.chat(messages, env.VALIDATOR_MODEL);
        return content;
    }

    /**
     * Normaliza una afirmación textual usando el prompt configurado desde base de datos.
     *
     * Utiliza el modelo del ValidatorAgent para transformar la afirmación original
     * en una versión canónica, clara y uniforme.
     *
     * @param claim Afirmación a normalizar.
     * @returns Objeto con la afirmación normalizada.
     */
    async normalizeClaimWithLlm(
        claim: string,
    ): Promise<{ normalizedClaim: string }> {
        const promptEntry = await this.promptService.getPrompt(
            'validator_agent',
            'VALIDATOR_NORMALIZE_CLAIM',
        );

        const prompt = promptEntry.prompt.replace('{{claim}}', claim);

        const content = await this.claude.chat(
            [{ role: 'user', content: prompt }],
            env.VALIDATOR_MODEL,
        );

        return {
            normalizedClaim: content.trim().replace(/^"|"$/g, ''),
        };
    }

    /**
     * Genera un embedding numérico a partir de texto, usando el proveedor configurado.
     *
     * @param text Texto a convertir.
     * @param model Modelo de embedding (por defecto: 'text-embedding-3-small').
     * @returns Vector de embedding (array de floats).
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
