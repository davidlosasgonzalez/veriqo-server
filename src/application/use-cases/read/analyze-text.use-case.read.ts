import { Injectable, Logger } from '@nestjs/common';
import { IAnalyzeTextInput } from '@/application/interfaces/analyze-text.interface';
import { LlmRouterService } from '@/shared/llm/services/llm-router.service';
import { PromptService } from '@/shared/llm/services/prompt.service';
import { LLMProvider } from '@/shared/types/enums/llm-provider.enum';
import { AgentPromptRole } from '@/shared/types/parsed-types/agent-prompt.types';
import { NormalizedClaim } from '@/shared/types/parsed-types/normalized-claim.type';
import { buildClaudePrompt } from '@/shared/utils/llm/build-claude-prompt';

/**
 * Caso de uso para analizar un texto utilizando un modelo de lenguaje (LLM).
 */
@Injectable()
export class AnalyzeTextUseCaseRead {
    private readonly logger = new Logger(AnalyzeTextUseCaseRead.name);

    constructor(
        private readonly llmRouterService: LlmRouterService,
        private readonly promptService: PromptService,
    ) {}

    /**
     * Analiza el texto proporcionado, extrae y normaliza afirmaciones potenciales.
     *
     * @param input - Objeto que contiene el texto a analizar.
     * @returns Lista de hallazgos normalizados.
     * @throws Error si el modelo no devuelve afirmaciones o si la respuesta no es un JSON válido.
     */
    async execute(input: IAnalyzeTextInput): Promise<NormalizedClaim[]> {
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

        const userPromptContent = userPrompt.content.replace(
            '{{text}}',
            input.text,
        );
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
                normalizedClaims.length < 1
            ) {
                throw new Error('El modelo no devolvió ninguna afirmación.');
            }

            return normalizedClaims;
        } catch (err) {
            this.logger.error(
                'Error al parsear la respuesta del modelo',
                err.stack,
            );
            throw new Error('La respuesta del modelo no es un JSON válido.');
        }
    }
}
