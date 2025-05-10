import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';

import { AgentLogService } from './agent-log.service';
import { ClaudeChatService } from './claude-chat.service';
import { OpenAiChatService } from './openai-chat.service';

import {
    LLM_PROVIDER,
    type LlmProvider,
} from '@/shared/domain/enums/llm-provider.enum';
import {
    ClaudeMessage,
    LlmMessage,
} from '@/shared/domain/value-objects/llm-message.vo';

@Injectable()
export class LlmRouterService {
    private readonly logger = new Logger(LlmRouterService.name);

    constructor(
        private readonly openaiChatService: OpenAiChatService,
        private readonly claudeChatService: ClaudeChatService,
        private readonly agentLogService: AgentLogService,
    ) {}

    /**
     * Enruta mensajes a OpenAI o Claude según el proveedor, gestiona tiempos, tokens y guarda un log completo.
     *
     * @param messages - Mensajes a enviar al modelo.
     * @param provider - Proveedor LLM (openai o anthropic).
     * @param agentName - Nombre del agente que realiza la solicitud.
     * @returns Respuesta generada por el modelo.
     */
    async chat(
        messages: LlmMessage[],
        provider: LlmProvider,
        agentName: string,
    ): Promise<{
        rawOutput: string;
        inputTokens: number;
        outputTokens: number;
        model: string;
    }> {
        const start = process.hrtime.bigint();
        let rawOutput = '';
        let inputTokens = 0;
        let outputTokens = 0;
        let model = '';

        try {
            if (provider === LLM_PROVIDER.ANTHROPIC) {
                const claudeMessages: ClaudeMessage[] = messages.filter(
                    (msg): msg is ClaudeMessage =>
                        msg.role === 'user' || msg.role === 'assistant',
                );
                const claudeRes =
                    await this.claudeChatService.chat(claudeMessages);

                rawOutput = claudeRes.rawOutput;
                inputTokens = claudeRes.inputTokens;
                outputTokens = claudeRes.outputTokens;
                model = claudeRes.model;
            } else {
                const openaiRes = await this.openaiChatService.chat(messages);

                rawOutput = openaiRes.rawOutput;
                inputTokens = openaiRes.inputTokens;
                outputTokens = openaiRes.outputTokens;
                model = openaiRes.model;
            }
        } catch (error) {
            const message = `Error comunicando con el modelo de IA (${provider})`;

            this.logger.error(
                `Error al consultar el modelo ${provider} para el agente "${agentName}"`,
                error instanceof Error ? error.stack : '',
            );

            throw new InternalServerErrorException(message);
        }

        const end = process.hrtime.bigint();
        const elapsedSeconds = Number(end - start) / 1_000_000_000;

        await this.agentLogService.create({
            agentName,
            model,
            inputPrompt: JSON.stringify(messages),
            outputResult: rawOutput,
            tokensInput: inputTokens,
            tokensOutput: outputTokens,
            elapsedTime: elapsedSeconds,
        });

        return {
            rawOutput,
            inputTokens,
            outputTokens,
            model,
        };
    }
}
