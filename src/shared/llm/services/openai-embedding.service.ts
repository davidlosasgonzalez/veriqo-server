import { TiktokenModel } from '@dqbd/tiktoken';
import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { OpenAI } from 'openai';

import { AgentLogService } from './agent-log.service';

import { env } from '@/config/env/env.config';
import { IEmbeddingService } from '@/shared/domain/interfaces/embedding-service.interface';
import { ensureValidEmbedding } from '@/shared/utils/embeddings/ensure-valid-embedding';
import { countTokens } from '@/shared/utils/llm/count-tokens';

@Injectable()
export class OpenAiEmbeddingService implements IEmbeddingService {
    private readonly logger = new Logger(OpenAiEmbeddingService.name);
    private readonly openai: OpenAI;

    constructor(private readonly agentLogService: AgentLogService) {
        const apiKey = env.OPENAI_API_KEY;

        if (!apiKey) {
            const message = 'No se encontró la clave API de OpenAI.';
            this.logger.error(message);

            throw new InternalServerErrorException(message);
        }

        this.openai = new OpenAI({ apiKey });
    }

    async generate(text: string): Promise<number[]> {
        const start = process.hrtime.bigint();
        const inputTokens = countTokens(
            text,
            env.LLM_EMBEDDING_MODEL as TiktokenModel,
        );

        const generate = async (): Promise<unknown> => {
            try {
                const res = await this.openai.embeddings.create({
                    model: env.LLM_EMBEDDING_MODEL,
                    input: text,
                    encoding_format: 'float',
                });

                return res.data?.[0]?.embedding;
            } catch (err) {
                const message = `Error generando embedding con OpenAI para el texto "${text.slice(0, 50)}..."`;

                this.logger.error(
                    message,
                    err instanceof Error ? err.stack : '',
                );

                throw new InternalServerErrorException(
                    'Error generando embedding con OpenAI',
                );
            }
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
