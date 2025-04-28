import { Injectable, Logger } from '@nestjs/common';
import { LlmRouterService } from '@/shared/llm/services/llm-router.service';
import { PromptService } from '@/shared/llm/services/prompt.service';
import { LLMProvider } from '@/shared/types/enums/llm-provider.enum';
import { AgentPromptRole } from '@/shared/types/parsed-types/agent-prompt.types';
import { NormalizedClaim } from '@/shared/types/parsed-types/normalized-claim.type';
import { buildClaudePrompt } from '@/shared/utils/llm/build-claude-prompt';

/**
 * Caso de uso READ para normalizar una afirmación libre en múltiples claims verificables.
 */
@Injectable()
export class NormalizeClaimsUseCaseRead {
    private readonly logger = new Logger(NormalizeClaimsUseCaseRead.name);

    constructor(
        private readonly llmRouterService: LlmRouterService,
        private readonly promptService: PromptService,
    ) {}

    /**
     * Convierte un texto libre en un array de afirmaciones normalizadas.
     *
     * @param claim - Afirmación o texto compuesto.
     * @returns Lista de afirmaciones claras y objetivas.
     * @throws Error si la respuesta no es un array JSON válido.
     */
    async execute(claim: string): Promise<NormalizedClaim[]> {
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
            const claims: NormalizedClaim[] = JSON.parse(raw);

            if (!Array.isArray(claims) || claims.length === 0) {
                throw new Error('El modelo no devolvió afirmaciones válidas.');
            }

            return claims;
        } catch (err) {
            this.logger.error(
                'Error al parsear la respuesta del modelo',
                err.stack,
            );
            throw new Error('La respuesta del modelo no es un JSON válido.');
        }
    }
}
