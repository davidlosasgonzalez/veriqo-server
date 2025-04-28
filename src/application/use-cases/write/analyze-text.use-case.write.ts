import { Injectable, Logger } from '@nestjs/common';
import { LlmRouterService } from '@/shared/llm/services/llm-router.service';
import { PromptService } from '@/shared/llm/services/prompt.service';
import { LLMProvider } from '@/shared/types/enums/llm-provider.enum';
import { AgentPromptRole } from '@/shared/types/parsed-types/agent-prompt.types';
import { buildClaudePrompt } from '@/shared/utils/llm/build-claude-prompt';

/**
 * Caso de uso para analizar un texto utilizando un modelo de lenguaje (LLM).
 */
@Injectable()
export class AnalyzeTextUseCaseWrite {
    private readonly logger = new Logger(AnalyzeTextUseCaseWrite.name);

    constructor(
        private readonly llmRouterService: LlmRouterService,
        private readonly promptService: PromptService,
    ) {}

    /**
     * Normaliza una afirmación textual usando un modelo LLM.
     *
     * @param claim - Afirmación original en texto libre.
     * @returns Lista de afirmaciones normalizadas.
     * @throws Error si la respuesta del modelo es inválida o no es un JSON válido.
     */
    async execute({ claim }: { claim: string }): Promise<string[]> {
        const systemPrompt = await this.promptService.findPromptByTypeAndRole(
            'VALIDATOR_NORMALIZE_CLAIMS',
            AgentPromptRole.SYSTEM,
        );
        const userPrompt = await this.promptService.findPromptByTypeAndRole(
            'VALIDATOR_NORMALIZE_CLAIMS',
            AgentPromptRole.USER,
        );

        if (!systemPrompt || !userPrompt) {
            throw new Error(
                'No se encontraron prompts SYSTEM o USER para VALIDATOR_NORMALIZE_CLAIMS.',
            );
        }

        const userPromptContent = userPrompt.content.replace('{{text}}', claim);
        const messages = buildClaudePrompt(
            systemPrompt.content,
            userPromptContent,
        );

        try {
            const raw = await this.llmRouterService.chat(
                messages,
                LLMProvider.CLAUDE,
            );
            const normalizedClaims = JSON.parse(raw);

            if (
                !Array.isArray(normalizedClaims) ||
                normalizedClaims.length === 0
            ) {
                throw new Error(
                    'El modelo devolvió un array vacío o inválido.',
                );
            }

            return normalizedClaims;
        } catch (err) {
            this.logger.error(
                'Error al parsear la respuesta del modelo',
                err.stack,
            );
            throw new Error('El modelo devolvió un JSON inválido.');
        }
    }
}
