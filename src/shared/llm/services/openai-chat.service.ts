import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import OpenAI from 'openai';

import { env } from '@/config/env/env.config';
import { LlmMessage } from '@/shared/domain/value-objects/llm-message.vo';
import { countTokens } from '@/shared/utils/llm/count-tokens';
import { mapToTiktokenModel } from '@/shared/utils/llm/map-to-tiktoken-model';

@Injectable()
export class OpenAiChatService {
    private readonly logger = new Logger(OpenAiChatService.name);
    private readonly client = new OpenAI({ apiKey: env.OPENAI_API_KEY });

    async chat(messages: LlmMessage[]): Promise<{
        rawOutput: string;
        inputTokens: number;
        outputTokens: number;
        model: string;
    }> {
        const model = env.LLM_FACTCHECKER_MODEL;
        const inputText = messages.map((msg) => msg.content).join(' ');
        const inputTokens = countTokens(inputText, mapToTiktokenModel(model));

        try {
            const res = await this.client.chat.completions.create({
                model,
                messages,
            });

            const rawOutput = res.choices[0]?.message?.content ?? '';

            const outputTokens = countTokens(
                rawOutput,
                mapToTiktokenModel(model),
            );

            return { rawOutput, inputTokens, outputTokens, model };
        } catch (err) {
            const message = 'Error comunicando con el modelo OpenAI.';

            this.logger.error(message, err instanceof Error ? err.stack : '');

            throw new InternalServerErrorException(message);
        }
    }
}
