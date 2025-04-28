import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { env } from '@/config/env/env.config';
import { IEmbeddingService } from '@/shared/interfaces/embedding-service.interface';
import { ensureValidEmbedding } from '@/shared/utils/embeddings/ensure-valid-embedding';

/**
 * Implementación de IEmbeddingService que utiliza la API de OpenAI para generar embeddings.
 */
@Injectable()
export class OpenAiEmbeddingService implements IEmbeddingService {
    private readonly openai: OpenAI;

    constructor() {
        const apiKey = env.OPENAI_API_KEY;

        if (!apiKey) {
            throw new Error('No se encontró la clave API de OpenAI.');
        }

        this.openai = new OpenAI({ apiKey });
    }

    /**
     * Genera un embedding vectorial para un texto dado.
     *
     * @param text - Texto de entrada a vectorizar.
     * @returns Vector numérico.
     */
    async generate(text: string): Promise<number[]> {
        const generate = async (): Promise<unknown> => {
            const response = await this.openai.embeddings.create({
                model: env.EMBEDDING_MODEL,
                input: text,
                encoding_format: 'float',
            });

            return response.data?.[0]?.embedding;
        };

        return ensureValidEmbedding(await generate(), generate);
    }
}
