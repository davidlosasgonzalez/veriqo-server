import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IAgentFindingRepository } from '@/application/interfaces/agent-finding-repository.interface';
import { AgentFact } from '@/domain/entities/agent-fact.entity';
import { AgentFindingSearchContext } from '@/domain/entities/agent-finding-search-context.entity';
import { AgentFinding } from '@/domain/entities/agent-finding.entity';
import { AgentReasoning } from '@/domain/entities/agent-reasoning.entity';
import { AgentVerification } from '@/domain/entities/agent-verification.entity';
import { AgentFindingSearchContextEntity } from '@/infrastructure/database/typeorm/entities/agent-finding-search-context.entity';
import { AgentFindingEntity } from '@/infrastructure/database/typeorm/entities/agent-finding.entity';
import { cosineSimilarity } from '@/shared/utils/math/cosine-similarity';

@Injectable()
export class AgentFindingRepository implements IAgentFindingRepository {
    constructor(
        @InjectRepository(AgentFindingEntity)
        private readonly ormRepo: Repository<AgentFindingEntity>,
    ) {}

    /**
     * Guarda múltiples hallazgos a la vez.
     *
     * @param findings Lista de entidades de dominio a persistir.
     */
    async saveMany(findings: AgentFinding[]): Promise<void> {
        const entities = findings.map(this.toOrmEntity);

        await this.ormRepo.save(entities);
    }

    /**
     * Guarda un hallazgo individual.
     *
     * @param finding Hallazgo a persistir.
     * @returns El hallazgo guardado con ID.
     */
    async save(finding: AgentFinding): Promise<AgentFinding> {
        const entity = this.toOrmEntity(finding);
        const saved = await this.ormRepo.save(entity);

        return this.toDomainEntity(saved);
    }

    /**
     * Busca un hallazgo por ID.
     *
     * @param id Identificador único del finding.
     * @returns El hallazgo si existe, o null.
     */
    async findById(id: string): Promise<AgentFinding | null> {
        const found = await this.ormRepo.findOne({
            where: { id },
            relations: [
                'relatedFact',
                'relatedFact.reasoning',
                'relatedFact.verifications',
                'searchContext',
            ],
        });

        return found ? this.toDomainEntity(found) : null;
    }

    /**
     * Devuelve todos los hallazgos existentes.
     */
    async findAll(): Promise<AgentFinding[]> {
        const all = await this.ormRepo.find({
            relations: [
                'relatedFact',
                'relatedFact.reasoning',
                'relatedFact.verifications',
                'searchContext',
            ],
        });

        return all.map(this.toDomainEntity);
    }

    /**
     * Busca un AgentFinding con una afirmación ya normalizada.
     *
     * @param claim Texto exacto del claim normalizado.
     * @returns Hallazgo si existe, o null.
     */
    async findByClaim(claim: string): Promise<AgentFinding | null> {
        const found = await this.ormRepo.findOne({
            where: { claim },
            relations: ['relatedFact'],
        });

        return found ? this.toDomainEntity(found) : null;
    }

    /**
     * Busca el AgentFinding más similar semánticamente usando embeddings y umbral.
     *
     * @param vector Embedding del claim a comparar.
     * @param threshold Umbral mínimo de similitud.
     * @returns El AgentFinding con mayor similitud, o null si ninguno supera el umbral.
     */
    async findMostSimilarEmbedding(
        vector: number[],
        threshold: number,
    ): Promise<AgentFinding | null> {
        const candidates = await this.ormRepo.find({
            relations: ['relatedFact'],
        });
        let bestMatch: AgentFindingEntity | null = null;
        let bestScore = -Infinity;

        for (const candidate of candidates) {
            const sim = cosineSimilarity(candidate.embedding, vector);

            if (sim >= threshold && sim > bestScore) {
                bestScore = sim;
                bestMatch = candidate;
            }
        }

        return bestMatch ? this.toDomainEntity(bestMatch) : null;
    }

    private toDomainEntity(entity: AgentFindingEntity): AgentFinding {
        const finding = new AgentFinding();

        finding.id = entity.id;
        finding.claim = entity.claim;
        finding.needsFactCheck = entity.needsFactCheck ?? null;
        finding.needsFactCheckReason = entity.needsFactCheckReason ?? null;
        finding.createdAt = entity.createdAt;
        finding.updatedAt = entity.updatedAt;

        if (entity.relatedFact) {
            const fact = new AgentFact();

            fact.id = entity.relatedFact.id;
            fact.status = entity.relatedFact.status;
            fact.category = entity.relatedFact.category ?? null;
            fact.createdAt = entity.relatedFact.createdAt;
            fact.updatedAt = entity.relatedFact.updatedAt;

            if (entity.relatedFact.reasoning) {
                fact.reasoning = this.toDomainReasoning(
                    entity.relatedFact.reasoning,
                );
            }

            if (entity.relatedFact.verifications) {
                fact.verifications = entity.relatedFact.verifications.map(
                    (verification) => this.toDomainVerification(verification),
                );
            }

            finding.fact = fact;
        }

        if (entity.searchContext) {
            finding.searchContext = this.toDomainSearchContext(
                entity.searchContext,
            );
        }

        return finding;
    }

    private toDomainSearchContext(
        entity: AgentFindingSearchContextEntity,
    ): AgentFindingSearchContext {
        return {
            id: entity.id,
            findingId: entity.finding?.id ?? '',
            keywords: entity.keywords,
            synonyms: entity.synonyms ?? null,
            searchQuery: entity.searchQuery,
            siteSuggestions: entity.siteSuggestions ?? null,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }

    private toDomainReasoning(entity: any): AgentReasoning {
        return {
            id: entity.id,
            content: entity.content,
            summary: entity.summary,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }

    private toDomainVerification(entity: any): AgentVerification {
        return {
            id: entity.id,
            method: entity.method,
            confidence: entity.confidence,
            sourcesUsed: entity.sourcesUsed ?? [],
            sourcesRetrieved: entity.sourcesRetrieved ?? [],
            isOutdated: entity.isOutdated,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            sourceType: entity.sourceType,
            fact: entity.fact?.id ?? '',
            reasoning: this.toDomainReasoning(entity.reasoning),
        };
    }

    private toOrmEntity(domain: AgentFinding): AgentFindingEntity {
        const entity = new AgentFindingEntity();

        entity.id = domain.id;
        entity.claim = domain.claim;
        entity.embedding = domain.embedding;
        entity.needsFactCheck = domain.needsFactCheck ?? null;
        entity.needsFactCheckReason = domain.needsFactCheckReason ?? null;
        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;
        entity.relatedFactId = domain.fact?.id ?? null;

        return entity;
    }
}
