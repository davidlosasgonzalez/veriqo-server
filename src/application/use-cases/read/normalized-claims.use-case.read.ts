import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AgentPromptEntity } from '@/infrastructure/database/typeorm/entities/agent-prompt.entity';
import { LlmRouterService } from '@/shared/llm/services/llm-router.service';
import { AgentPromptRole } from '@/shared/types/agent-prompt.types';
import { NormalizedClaim } from '@/shared/types/normalized-claim.type';
import { buildClaudePrompt } from '@/shared/utils/llm/build-claude-prompt';

/**
 * Caso de uso READ para normalizar una afirmación libre en múltiples claims verificables.
 */
@Injectable()
export class NormalizeClaimsUseCaseRead {
    private readonly logger = new Logger(NormalizeClaimsUseCaseRead.name);

    constructor(
        private readonly llmRouterService: LlmRouterService,
        @InjectRepository(AgentPromptEntity)
        private readonly promptRepo: Repository<AgentPromptEntity>,
    ) {}

    /**
     * Convierte un texto libre en un array de afirmaciones normalizadas.
     *
     * @param claim Afirmación o texto compuesto.
     * @returns Lista de afirmaciones claras y objetivas.
     * @throws Error si la respuesta no es un array JSON válido.
     */
    async execute(claim: string): Promise<NormalizedClaim[]> {
        const prompt = await this.promptRepo.findOneBy({
            agent: 'validator_agent',
            type: 'VALIDATOR_NORMALIZE_CLAIMS',
            role: AgentPromptRole.SYSTEM,
        });
        const formattedPrompt = buildClaudePrompt(prompt?.content ?? '', claim);

        try {
            const raw = await this.llmRouterService.chat([formattedPrompt]);
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
