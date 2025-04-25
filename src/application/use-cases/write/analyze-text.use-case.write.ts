import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AgentPromptEntity } from '@/infrastructure/database/typeorm/entities/agent-prompt.entity';
import { LlmRouterService } from '@/shared/llm/services/llm-router.service';
import { AgentPromptRole } from '@/shared/types/agent-prompt.types';
import { buildClaudePrompt } from '@/shared/utils/llm/build-claude-prompt';

@Injectable()
export class AnalyzeTextUseCaseWrite {
    private readonly logger = new Logger(AnalyzeTextUseCaseWrite.name);

    constructor(
        private readonly llmRouterService: LlmRouterService,
        @InjectRepository(AgentPromptEntity)
        private readonly promptRepo: Repository<AgentPromptEntity>,
    ) {}

    /**
     * Normaliza una afirmación textual usando un modelo LLM.
     *
     * @param claim Afirmación original en texto libre.
     * @returns Lista de afirmaciones normalizadas.
     * @throws Error si la respuesta del modelo es inválida o no es un JSON válido.
     */
    async execute({ claim }: { claim: string }): Promise<string[]> {
        const prompt = await this.promptRepo.findOneBy({
            agent: 'validator_agent',
            type: 'VALIDATOR_NORMALIZE_CLAIMS',
            role: AgentPromptRole.SYSTEM,
        });
        const input = buildClaudePrompt(prompt?.content ?? '', claim);
        const raw = await this.llmRouterService.chat([input]);

        try {
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
