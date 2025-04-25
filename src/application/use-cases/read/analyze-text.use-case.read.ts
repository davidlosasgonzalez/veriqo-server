import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IAnalyzeTextInput } from '@/application/interfaces/analyze-text-input.interface';
import { AgentPromptEntity } from '@/infrastructure/database/typeorm/entities/agent-prompt.entity';
import { LlmRouterService } from '@/shared/llm/services/llm-router.service';
import { AgentPromptRole } from '@/shared/types/agent-prompt.types';
import { NormalizedClaim } from '@/shared/types/normalized-claim.type';
import { buildClaudePrompt } from '@/shared/utils/llm/build-claude-prompt';

/**
 * Caso de uso para analizar un texto utilizando un modelo de lenguaje (LLM).
 */
@Injectable()
export class AnalyzeTextUseCaseRead {
    private readonly logger = new Logger(AnalyzeTextUseCaseRead.name);

    constructor(
        private readonly llmRouterService: LlmRouterService,
        @InjectRepository(AgentPromptEntity)
        private readonly promptRepo: Repository<AgentPromptEntity>,
    ) {}

    /**
     * Analiza el texto proporcionado, extrae y normaliza afirmaciones potenciales.
     *
     * @param input Objeto que contiene el texto a analizar.
     * @returns Lista de hallazgos normalizados.
     * @throws Error si el modelo no devuelve afirmaciones o si la respuesta no es un JSON válido.
     */
    async execute(input: IAnalyzeTextInput): Promise<NormalizedClaim[]> {
        const prompt = await this.promptRepo.findOneBy({
            agent: 'validator_agent',
            type: 'VALIDATOR_NORMALIZE_CLAIMS',
            role: AgentPromptRole.SYSTEM,
        });
        const claudePrompt = buildClaudePrompt(
            prompt?.content ?? '',
            input.text,
        );

        try {
            const normalizedClaims = await JSON.parse(
                await this.llmRouterService.chat([claudePrompt]),
            );

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
