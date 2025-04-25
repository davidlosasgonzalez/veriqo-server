import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { env } from '@/config/env/env.config';
import { LlmMessage } from '@/shared/types/llm-message.type';

@Injectable()
export class OpenAiChatService {
    private readonly client = new OpenAI({ apiKey: env.OPENAI_API_KEY });

    async chat(
        messages: LlmMessage[],
        model: string = 'gpt-4',
    ): Promise<string> {
        const response = await this.client.chat.completions.create({
            model,
            messages,
        });

        return response.choices[0]?.message?.content ?? '';
    }
}
