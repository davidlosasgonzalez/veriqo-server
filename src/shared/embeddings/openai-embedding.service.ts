import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { env } from '@/config/env/env.config';
import { ensureValidEmbedding } from '@/shared/utils/embeddings/ensure-valid-embedding';

/**
 * Servicio para generar embeddings usando la API de OpenAI.
 */
@Injectable()
export class OpenAIEmbeddingService {
    private readonly openai: OpenAI;

    constructor() {
        const apiKey = env.OPENAI_API_KEY;

        if (!apiKey) {
            throw new Error('No se encontró la clave API de OpenAI.');
        }

        this.openai = new OpenAI({ apiKey });
    }

    /**
     * Genera un embedding numérico para el texto especificado.
     *
     * @param text Texto de entrada
     * @param model Modelo de embedding (por defecto: text-embedding-3-small)
     * @returns Vector numérico de embedding
     */
    async generateEmbedding(
        text: string,
        model: string = 'text-embedding-3-small',
    ): Promise<number[]> {
        const generate = async (): Promise<unknown> => {
            const response = await this.openai.embeddings.create({
                model,
                input: text,
                encoding_format: 'float',
            });

            return response.data?.[0]?.embedding;
        };

        return ensureValidEmbedding(await generate(), generate);
    }
}
