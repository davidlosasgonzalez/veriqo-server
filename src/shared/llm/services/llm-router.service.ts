import { Injectable } from '@nestjs/common';
import { AgentLogService } from './agent-log.service';
import { ClaudeChatService } from './claude-chat.service';
import { OpenAiChatService } from './openai-chat.service';
import { LlmProvider } from '@/shared/types/enums/llm-provider.enum';
import {
    ClaudeMessage,
    LlmMessage,
} from '@/shared/types/parsed-types/llm-message.type';
/**
 * Servicio que enruta mensajes a OpenAI o Claude, genera la respuesta y registra automáticamente el log de la interacción.
 */
@Injectable()
export class LlmRouterService {
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
            if (provider === LlmProvider.ANTHROPIC) {
                const claudeMessages: ClaudeMessage[] = messages.filter(
                    (msg): msg is ClaudeMessage =>
                        msg.role === 'user' || msg.role === 'assistant',
                );
                const claudeResponse =
                    await this.claudeChatService.chat(claudeMessages);

                rawOutput = claudeResponse.rawOutput;
                inputTokens = claudeResponse.inputTokens;
                outputTokens = claudeResponse.outputTokens;
                model = claudeResponse.model;
            } else {
                const openaiResponse =
                    await this.openaiChatService.chat(messages);

                rawOutput = openaiResponse.rawOutput;
                inputTokens = openaiResponse.inputTokens;
                outputTokens = openaiResponse.outputTokens;
                model = openaiResponse.model;
            }
        } catch (error) {
            console.error(
                '[LlmRouterService] Error al consultar el modelo:',
                error,
            );
            throw new Error('Error comunicando con el modelo de IA.');
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
