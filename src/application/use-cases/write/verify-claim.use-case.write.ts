import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateAgentFactUseCaseWrite } from './create-agent-fact.use-case.write';
import { CreateAgentFindingSearchContextUseCaseWrite } from './create-agent-finding-search-context.use-case.write';
import { CreateAgentFindingUseCaseWrite } from './create-agent-finding.use-case.write';
import { CreateAgentReasoningUseCaseWrite } from './create-agent-reasoning.use-case.write';
import { FindFactByFindingClaimUseCaseRead } from '../read/find-fact-by-finding-claim.use-case.read';
import { NormalizeClaimsUseCaseRead } from '../read/normalized-claims.use-case.read';
import { IAgentFindingRepository } from '@/application/interfaces/agent-finding-repository.interface';
import { AgentFindingRepositoryToken } from '@/application/tokens/agent-finding-repository.token';
import { EmbeddingServiceToken } from '@/application/tokens/embedding.token';
import { env } from '@/config/env/env.config';
import { AgentFact } from '@/domain/entities/agent-fact.entity';
import { AgentReasoning } from '@/domain/entities/agent-reasoning.entity';
import { AgentPromptEntity } from '@/infrastructure/database/typeorm/entities/agent-prompt.entity';
import { IEmbeddingService } from '@/shared/interfaces/embedding-service.interface';
import { LlmRouterService } from '@/shared/llm/services/llm-router.service';
import {
    AgentFactStatus,
    AgentFactCategory,
} from '@/shared/types/agent-fact.types';
import { AgentPromptRole } from '@/shared/types/agent-prompt.types';
import { NormalizedClaim } from '@/shared/types/normalized-claim.type';
import { buildClaudePrompt } from '@/shared/utils/llm/build-claude-prompt';

/**
 * Caso de uso WRITE para orquestar el flujo completo de verificación de un claim textual.
 */
@Injectable()
export class VerifyClaimUseCaseWrite {
    constructor(
        @Inject(EmbeddingServiceToken)
        private readonly embeddingService: IEmbeddingService,
        @Inject(AgentFindingRepositoryToken)
        private readonly agentFindingRepository: IAgentFindingRepository,
        @InjectRepository(AgentPromptEntity)
        private readonly promptRepo: Repository<AgentPromptEntity>,
        private readonly normalizeClaims: NormalizeClaimsUseCaseRead,
        private readonly createFact: CreateAgentFactUseCaseWrite,
        private readonly createFinding: CreateAgentFindingUseCaseWrite,
        private readonly createReasoning: CreateAgentReasoningUseCaseWrite,
        private readonly createSearchContext: CreateAgentFindingSearchContextUseCaseWrite,
        private readonly llmRouterService: LlmRouterService,
    ) {}

    /**
     * Orquesta el flujo de validación de un claim: normaliza, deduplica, valida y decide.
     *
     * @param input Texto a verificar.
     * @returns Lista de AgentFact generados (uno por cada afirmación no duplicada).
     */
    async execute(input: { claim: string }): Promise<AgentFact[]> {
        const normalizedClaims: NormalizedClaim[] =
            await this.normalizeClaims.execute(input.claim);
        const results: AgentFact[] = [];

        for (const claim of normalizedClaims) {
            const embedding = await this.embeddingService.generate(claim);
            const similar =
                await this.agentFindingRepository.findMostSimilarEmbedding(
                    embedding,
                    env.EMBEDDING_SIMILARITY_THRESHOLD,
                );

            if (similar?.fact) {
                console.log('[FACT MATCHED]', similar.fact.id);
                await this.createFinding.execute(
                    claim,
                    similar.fact,
                    embedding,
                );
                results.push(similar.fact);
                continue;
            }

            const validation = await this.validateClaimInternally(claim);
            const fact = await this.createFact.execute({
                claim,
                status: validation.status,
                category: validation.category,
            });
            const finding = await this.createFinding.execute(
                claim,
                fact,
                embedding,
            );

            if (validation.status === AgentFactStatus.FACT_CHECKING) {
                await this.createSearchContext.execute({
                    findingId: finding.id,
                    keywords: validation.keywords ?? [],
                    synonyms: validation.synonyms ?? null,
                    searchQuery: validation.searchQuery ?? {},
                    siteSuggestions: validation.siteSuggestions ?? null,
                });
            } else {
                const reasoning: AgentReasoning =
                    await this.createReasoning.execute({
                        summary: validation.summary ?? '',
                        content: validation.reasoning ?? '',
                    });

                fact.reasoning = reasoning;
            }

            results.push(fact);
        }

        return results;
    }

    /**
     * Valida una afirmación normalizada usando el modelo Claude y el prompt FACT_INTERNAL_VALIDATE.
     *
     * @param claim Afirmación normalizada a validar.
     * @returns Objeto con status, categoría y trazabilidad semántica.
     * @throws Error si el modelo no responde correctamente.
     */
    private async validateClaimInternally(claim: string): Promise<{
        status: AgentFactStatus;
        category: AgentFactCategory | null;
        reasoning?: string;
        summary?: string;
        keywords?: string[];
        synonyms?: Record<string, string[]>;
        searchQuery?: Record<string, string>;
        siteSuggestions?: string[];
    }> {
        const prompt = await this.promptRepo.findOneBy({
            agent: 'validator_agent',
            type: 'FACT_INTERNAL_VALIDATE',
            role: AgentPromptRole.SYSTEM,
        });

        if (!prompt) {
            throw new Error('Prompt FACT_INTERNAL_VALIDATE no encontrado.');
        }

        const claudeInput = buildClaudePrompt(prompt.content, claim);
        const raw = await this.llmRouterService.chat([claudeInput]);

        try {
            const parsed = JSON.parse(raw);

            if (!parsed.status || typeof parsed.status !== 'string') {
                throw new Error('Respuesta inválida del modelo LLM.');
            }

            return {
                status: parsed.status,
                category: parsed.category ?? null,
                summary: parsed.summary,
                reasoning: parsed.reasoning,
                keywords: parsed.keywords,
                synonyms: parsed.synonyms,
                searchQuery: parsed.searchQuery,
                siteSuggestions: parsed.siteSuggestions,
            };
        } catch (err) {
            console.error('[LLM PARSE ERROR]', err);
            throw new Error('La respuesta del modelo no es un JSON válido.');
        }
    }
}
