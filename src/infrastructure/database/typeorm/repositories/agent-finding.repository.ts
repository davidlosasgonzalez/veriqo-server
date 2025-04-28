import { Injectable, NotFoundException } from '@nestjs/common';
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
import { AgentReasoningEntity } from '@/infrastructure/database/typeorm/entities/agent-reasoning.entity';
import { AgentVerificationEntity } from '@/infrastructure/database/typeorm/entities/agent-verification.entity';
import { SearchEngineUsed } from '@/shared/types/enums/search-engine-used.enum';
import { cosineSimilarity } from '@/shared/utils/math/cosine-similarity';

/**
 * Repositorio para la gestión de AgentFinding.
 */
@Injectable()
export class AgentFindingRepository implements IAgentFindingRepository {
    constructor(
        @InjectRepository(AgentFindingEntity)
        private readonly agentFindingRepo: Repository<AgentFindingEntity>,
    ) {}

    /**
     * Guarda múltiples hallazgos en base de datos.
     */
    async saveMany(findings: AgentFinding[]): Promise<void> {
        const entities = findings.map(this.toOrmEntity);

        await this.agentFindingRepo.save(entities);
    }

    /**
     * Guarda un hallazgo individual en base de datos.
     */
    async save(finding: AgentFinding): Promise<AgentFinding> {
        const entity = this.toOrmEntity(finding);
        const saved = await this.agentFindingRepo.save(entity);

        return this.toDomainEntity(saved);
    }

    /**
     * Busca un hallazgo por su ID.
     */
    async findById(id: string): Promise<AgentFinding | null> {
        const found = await this.agentFindingRepo.findOne({
            where: { id },
            relations: [
                'relatedFact',
                'relatedFact.currentReasoning',
                'relatedFact.verifications',
                'searchContext',
                'searchContext.finding',
            ],
        });

        if (!found) {
            return null;
        }

        const domainFinding = this.toDomainEntity(found);

        if (domainFinding.searchContext) {
            domainFinding.searchContext.searchResults =
                domainFinding.searchContext.searchResults ?? [];
        }

        return domainFinding;
    }

    /**
     * Devuelve todos los hallazgos almacenados.
     */
    async findAll(): Promise<AgentFinding[]> {
        const all = await this.agentFindingRepo.find({
            relations: [
                'relatedFact',
                'relatedFact.currentReasoning',
                'searchContext',
            ],
        });

        return all.map((entity) => this.toDomainEntity(entity));
    }

    /**
     * Busca un hallazgo por el claim exacto.
     */
    async findByClaim(claim: string): Promise<AgentFinding | null> {
        const found = await this.agentFindingRepo.findOne({
            where: { claim },
            relations: [
                'relatedFact',
                'relatedFact.currentReasoning',
                'relatedFact.verifications',
            ],
        });

        return found ? this.toDomainEntity(found) : null;
    }

    /**
     * Busca el hallazgo con embedding más similar que supere el umbral.
     */
    async findMostSimilarEmbedding(
        vector: number[],
        threshold: number,
    ): Promise<AgentFinding | null> {
        const candidates = await this.agentFindingRepo.find({
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

    /**
     * Convierte una entidad ORM en una entidad de dominio.
     */
    private toDomainEntity(entity: AgentFindingEntity): AgentFinding {
        const finding = new AgentFinding();

        finding.id = entity.id;
        finding.claim = entity.claim;
        finding.needsFactCheckReason = entity.needsFactCheckReason ?? null;
        finding.createdAt = entity.createdAt;
        finding.updatedAt = entity.updatedAt;

        if (entity.relatedFact) {
            const fact = new AgentFact();

            fact.id = entity.relatedFact.id;
            fact.status = entity.relatedFact.status;
            fact.category = entity.relatedFact.category;
            fact.createdAt = entity.relatedFact.createdAt;
            fact.updatedAt = entity.relatedFact.updatedAt;

            if (entity.relatedFact.currentReasoning) {
                fact.currentReasoning = this.toDomainReasoning(
                    entity.relatedFact.currentReasoning,
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

    /**
     * Convierte un contexto de búsqueda ORM a dominio.
     */
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
            searchResults: entity.searchResults ?? null,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }

    /**
     * Convierte un razonamiento ORM a dominio.
     */
    private toDomainReasoning(entity: AgentReasoningEntity): AgentReasoning {
        return {
            id: entity.id,
            content: entity.content,
            summary: entity.summary,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }

    /**
     * Convierte una verificación ORM a dominio.
     */
    private toDomainVerification(
        entity: AgentVerificationEntity,
    ): AgentVerification {
        const verification = new AgentVerification();

        verification.id = entity.id;
        verification.engineUsed = entity.engineUsed as SearchEngineUsed;
        verification.confidence = entity.confidence;
        verification.sourcesUsed = entity.sourcesUsed ?? [];
        verification.sourcesRetrieved = entity.sourcesRetrieved ?? [];
        verification.isOutdated = entity.isOutdated ?? false;
        verification.createdAt = entity.createdAt;
        verification.updatedAt = entity.updatedAt;
        verification.reasoning = entity.reasoning
            ? this.toDomainReasoning(entity.reasoning)
            : undefined;

        verification.fact = entity.fact
            ? {
                  id: entity.fact.id,
                  status: entity.fact.status,
                  category: entity.fact.category,
                  createdAt: entity.fact.createdAt,
                  updatedAt: entity.fact.updatedAt,
              }
            : null;

        return verification;
    }

    /**
     * Convierte una entidad de dominio en una entidad ORM.
     */
    private toOrmEntity(domain: AgentFinding): AgentFindingEntity {
        const entity = new AgentFindingEntity();

        entity.id = domain.id;
        entity.claim = domain.claim;
        entity.embedding = domain.embedding;
        entity.needsFactCheckReason = domain.needsFactCheckReason ?? null;
        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;
        entity.relatedFactId = domain.fact?.id ?? null;

        return entity;
    }
}
