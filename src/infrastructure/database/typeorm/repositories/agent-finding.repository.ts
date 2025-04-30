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
     * @param findings - Lista de entidades de dominio a persistir.
     */
    async saveMany(findings: AgentFinding[]): Promise<void> {
        const entities = findings.map(this.toOrmEntity);

        await this.agentFindingRepo.save(entities);
    }

    /**
     * Guarda un hallazgo individual en base de datos.
     * @param finding - Entidad de dominio a guardar.
     * @returns Hallazgo persistido como entidad de dominio.
     */
    async save(finding: AgentFinding): Promise<AgentFinding> {
        const entity = this.toOrmEntity(finding);
        const saved = await this.agentFindingRepo.save(entity);

        return this.toDomainEntity(saved);
    }

    /**
     * Busca un hallazgo por su ID.
     * @param id - Identificador único del hallazgo.
     * @returns Entidad de dominio si se encuentra, o null en caso contrario.
     */
    async findById(id: string): Promise<AgentFinding | null> {
        const found = await this.agentFindingRepo.findOne({
            where: { id },
            relations: [
                'relatedFact',
                'relatedFact.verifications',
                'relatedFact.verifications.reasoning',
                'searchContext',
                'searchContext.finding',
            ],
        });

        return found ? this.toDomainEntity(found) : null;
    }

    /**
     * Recupera todos los hallazgos almacenados en base de datos.
     * @returns Lista de entidades de dominio AgentFinding.
     */
    async findAll(): Promise<AgentFinding[]> {
        const all = await this.agentFindingRepo.find({
            relations: ['relatedFact', 'searchContext'],
        });

        return all.map((entity) => this.toDomainEntity(entity));
    }

    /**
     * Busca un hallazgo por el texto exacto del claim.
     * @param claim - Texto normalizado del claim.
     * @returns Entidad de dominio si existe, o null si no se encuentra.
     */
    async findByClaim(claim: string): Promise<AgentFinding | null> {
        const found = await this.agentFindingRepo.findOne({
            where: { claim },
            relations: [
                'relatedFact',
                'relatedFact.verifications',
                'relatedFact.verifications.reasoning',
                'searchContext',
                'searchContext.finding',
            ],
        });

        return found ? this.toDomainEntity(found) : null;
    }

    /**
     * Busca el hallazgo cuyo embedding sea más similar al vector recibido.
     * @param vector - Embedding vectorial a comparar.
     * @param threshold - Umbral de similitud mínima aceptada.
     * @returns Hallazgo más similar que supere el umbral, o null si no hay coincidencias suficientes.
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
     * Convierte una entidad ORM a entidad de dominio AgentFinding.
     * @param entity - Entidad cargada desde base de datos.
     * @returns Instancia de dominio AgentFinding.
     */
    /**
     * Convierte una entidad ORM a entidad de dominio AgentFinding.
     * @param entity - Entidad cargada desde base de datos.
     * @returns Instancia de dominio AgentFinding.
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

            fact.verifications =
                entity.relatedFact.verifications?.map((v) => {
                    const verification = new AgentVerification();

                    verification.id = v.id;
                    verification.engineUsed = v.engineUsed;
                    verification.confidence = v.confidence;
                    verification.sourcesUsed = v.sourcesUsed ?? [];
                    verification.sourcesRetrieved = v.sourcesRetrieved ?? [];
                    verification.isOutdated = v.isOutdated ?? false;
                    verification.createdAt = v.createdAt;
                    verification.updatedAt = v.updatedAt;
                    verification.factId = v.fact?.id ?? null;

                    if (v.reasoning) {
                        const reasoning = new AgentReasoning();

                        reasoning.id = v.reasoning.id;
                        reasoning.summary = v.reasoning.summary;
                        reasoning.content = v.reasoning.content;
                        reasoning.createdAt = v.reasoning.createdAt;
                        reasoning.updatedAt = v.reasoning.updatedAt;
                        reasoning.verificationId =
                            v.reasoning.verification?.id ?? null;
                        reasoning.factId = v.reasoning.fact?.id ?? null;

                        verification.reasoning = reasoning;
                    }

                    return verification;
                }) ?? [];

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
     * Convierte una entidad ORM AgentFindingSearchContext a su representación de dominio.
     * @param entity - Entidad de contexto de búsqueda ORM.
     * @returns Objeto de dominio AgentFindingSearchContext.
     */
    private toDomainSearchContext(
        entity: AgentFindingSearchContextEntity,
    ): AgentFindingSearchContext {
        return {
            id: entity.id,
            findingId: entity.finding?.id ?? undefined,
            searchQuery: entity.searchQuery,
            siteSuggestions: entity.siteSuggestions ?? null,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }

    /**
     * Convierte una entidad de dominio AgentFinding a su representación ORM.
     * @param domain - Entidad de dominio AgentFinding.
     * @returns Entidad ORM lista para persistir.
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
