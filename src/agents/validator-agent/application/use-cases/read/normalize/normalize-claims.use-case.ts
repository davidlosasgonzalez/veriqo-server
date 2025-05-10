import { Injectable, Logger } from '@nestjs/common';

import { NormalizeClaimsQuery } from '../../../queries/normalize/normalize-claims.query';

import { env } from '@/config/env/env.config';
import { AGENT_PROMPT_ROLE } from '@/shared/domain/enums/agent-prompt-role.enum';
import { LlmModel } from '@/shared/domain/enums/llm-model.enum';
import { LlmProvider } from '@/shared/domain/enums/llm-provider.enum';
import { NormalizedClaim } from '@/shared/domain/value-objects/normalized-claim.vo';
import { AgentPromptService } from '@/shared/llm/services/agent-prompt.service';
import { LlmRouterService } from '@/shared/llm/services/llm-router.service';
import { buildClaudePrompt } from '@/shared/utils/llm/build-claude-prompt';

@Injectable()
export class NormalizeClaimsUseCase {
    private readonly logger = new Logger(NormalizeClaimsUseCase.name);

    constructor(
        private readonly llmRouterService: LlmRouterService,
        private readonly promptService: AgentPromptService,
    ) {}

    async execute(query: NormalizeClaimsQuery): Promise<NormalizedClaim[]> {
        const systemPrompt = await this.promptService.findPromptByTypeAndRole(
            'VALIDATOR_NORMALIZE_CLAIMS',
            AGENT_PROMPT_ROLE.SYSTEM,
        );
        const userPrompt = await this.promptService.findPromptByTypeAndRole(
            'VALIDATOR_NORMALIZE_CLAIMS',
            AGENT_PROMPT_ROLE.USER,
        );

        if (!systemPrompt || !userPrompt) {
            throw new Error(
                'No se encontraron prompts SYSTEM o USER para VALIDATOR_NORMALIZE_CLAIMS.',
            );
        }

        const userPromptContent = userPrompt.content.replace(
            '{{text}}',
            query.payload.claim,
        );

        // TODO: revisar
        const systemText = String(systemPrompt.content);
        const userText = String(userPromptContent);

        const messages = buildClaudePrompt(systemText, userText);

        try {
            const { rawOutput } = await this.llmRouterService.chat(
                messages,
                env.LLM_VALIDATOR_PROVIDER as LlmProvider,
                env.LLM_VALIDATOR_MODEL as LlmModel,
            );
            const claims: NormalizedClaim[] = JSON.parse(rawOutput);

            if (!Array.isArray(claims) || claims.length === 0) {
                throw new Error('El modelo no devolvió afirmaciones válidas.');
            }

            return claims;
        } catch (err) {
            this.logger.error(
                'Error al parsear la respuesta del modelo',
                err instanceof Error ? err.stack : String(err),
                NormalizeClaimsUseCase.name,
            );
            throw new Error('La respuesta del modelo no es un JSON válido.');
        }
    }
}
