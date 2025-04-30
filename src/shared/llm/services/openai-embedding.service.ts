import { TiktokenModel } from '@dqbd/tiktoken';
import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { AgentLogService } from './agent-log.service';
import { env } from '@/config/env/env.config';
import { IEmbeddingService } from '@/shared/interfaces/embedding-service.interface';
import { ensureValidEmbedding } from '@/shared/utils/embeddings/ensure-valid-embedding';
import { countTokens } from '@/shared/utils/llm/count-tokens';

/**
 * Implementación de IEmbeddingService que utiliza la API de OpenAI para generar embeddings,
 * registrando también los tokens de entrada utilizados.
 */
@Injectable()
export class OpenAiEmbeddingService implements IEmbeddingService {
    private readonly openai: OpenAI;

    constructor(
        private readonly agentLogService: AgentLogService, // Inyección del servicio de logs
    ) {
        const apiKey = env.OPENAI_API_KEY;

        if (!apiKey) {
            throw new Error('No se encontró la clave API de OpenAI.');
        }

        this.openai = new OpenAI({ apiKey });
    }

    /**
     * Genera un embedding vectorial para un texto dado y registra la operación en logs.
     *
     * @param text - Texto de entrada a vectorizar.
     * @returns Vector numérico.
     */
    async generate(text: string): Promise<number[]> {
        const start = process.hrtime.bigint();
        const inputTokens = countTokens(
            text,
            env.LLM_EMBEDDING_MODEL as TiktokenModel,
        );
        const generate = async (): Promise<unknown> => {
            const response = await this.openai.embeddings.create({
                model: env.LLM_EMBEDDING_MODEL,
                input: text,
                encoding_format: 'float',
            });

            return response.data?.[0]?.embedding;
        };

        const embedding = await ensureValidEmbedding(
            await generate(),
            generate,
        );
        const end = process.hrtime.bigint();
        const elapsedSeconds = Number(end - start) / 1_000_000_000;

        await this.agentLogService.create({
            agentName: 'embedding_service',
            model: env.LLM_EMBEDDING_MODEL,
            inputPrompt: text,
            outputResult: '[Embedding Generated]',
            tokensInput: inputTokens,
            tokensOutput: 0,
            elapsedTime: elapsedSeconds,
        });

        return embedding;
    }
}
