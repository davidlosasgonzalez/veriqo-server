import Anthropic from '@anthropic-ai/sdk';
import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';

import { env } from '@/config/env/env.config';
import { ClaudeMessage } from '@/shared/domain/value-objects/llm-message.vo';
import { countTokens } from '@/shared/utils/llm/count-tokens';
import { mapToTiktokenModel } from '@/shared/utils/llm/map-to-tiktoken-model';

@Injectable()
export class ClaudeChatService {
    private readonly logger = new Logger(ClaudeChatService.name);
    private readonly anthropic = new Anthropic({ apiKey: env.CLAUDE_API_KEY });

    async chat(messages: ClaudeMessage[]): Promise<{
        rawOutput: string;
        inputTokens: number;
        outputTokens: number;
        model: string;
    }> {
        const model = env.LLM_VALIDATOR_MODEL;
        const inputText = messages.map((msg) => msg.content).join(' ');
        const inputTokens = countTokens(inputText, mapToTiktokenModel(model));

        try {
            const res = await this.anthropic.messages.create({
                model,
                max_tokens: 1024,
                messages,
            });

            const textBlock = res.content.find(
                (block) => block.type === 'text',
            ) as { type: 'text'; text: string } | undefined;

            if (!textBlock) {
                const errorMsg =
                    'Claude no devolvió ningún bloque de texto válido.';
                this.logger.error(errorMsg);

                throw new InternalServerErrorException(errorMsg);
            }

            const rawOutput = textBlock.text;
            const outputTokens = countTokens(
                rawOutput,
                mapToTiktokenModel(model),
            );

            return { rawOutput, inputTokens, outputTokens, model };
        } catch (error) {
            const message = 'Error comunicando con el modelo Claude.';

            this.logger.error(
                message,
                error instanceof Error ? error.stack : '',
            );

            throw new InternalServerErrorException(message);
        }
    }
}
