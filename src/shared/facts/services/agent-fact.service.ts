import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, Not, IsNull } from 'typeorm';
import { env } from '@/config/env/env.config';
import { AgentFact } from '@/core/database/entities/agent-fact.entity';
import { OpenAIEmbeddingService } from '@/shared/embeddings/openai-embedding.service';
import { vectorSimilarity } from '@/shared/utils/embeddings/vector-similarity';

/**
 * Servicio responsable de gestionar hechos verificados (AgentFact),
 * su persistencia, deduplicación, comparación por embeddings y actualizaciones.
 */
@Injectable()
export class AgentFactService {
    private readonly logger = new Logger(AgentFactService.name);

    constructor(
        @InjectRepository(AgentFact)
        private readonly factRepo: Repository<AgentFact>,
        private readonly embeddingService: OpenAIEmbeddingService,
    ) {}

    /**
     * Guarda un fact nuevo o actualiza uno existente si el claim cambia o su estado/sources cambian.
     */
    async create(
        _agent: string,
        claim: string,
        status: AgentFact['status'],
        sources: string[],
        normalizedClaim?: string,
    ): Promise<AgentFact> {
        const normalized =
            normalizedClaim?.trim().toLowerCase() || claim.toLowerCase().trim();
        const embedding = await this.embeddingService.generateEmbedding(claim);

        const existing = await this.factRepo.findOneBy({
            normalizedClaim: normalized,
        });

        if (existing) {
            const sourcesChanged =
                JSON.stringify(existing.sources) !== JSON.stringify(sources);
            const statusChanged = existing.status !== status;

            if (sourcesChanged || statusChanged || existing.claim !== claim) {
                existing.claim = claim;
                existing.status = status;
                existing.sources = sources;
                existing.embedding = embedding;
                return this.factRepo.save(existing);
            }

            return existing;
        }

        const newFact = this.factRepo.create({
            claim,
            normalizedClaim: normalized,
            status,
            sources,
            embedding,
        });

        return this.factRepo.save(newFact);
    }

    /**
     * Busca un fact por claim normalizado, limitado por antigüedad máxima.
     */
    async findByNormalizedClaim(normalized: string): Promise<AgentFact | null> {
        const threshold = new Date();
        threshold.setDate(
            threshold.getDate() - (env.FACT_CHECK_CACHE_DAYS || 7),
        );

        return this.factRepo.findOne({
            where: {
                normalizedClaim: normalized,
                updatedAt: MoreThan(threshold),
            },
        });
    }

    /**
     * Normaliza un claim y lo busca.
     */
    async findByClaim(claim: string): Promise<AgentFact | null> {
        return this.findByNormalizedClaim(claim.toLowerCase().trim());
    }

    /**
     * Obtiene un fact por su ID.
     */
    async findById(id: string): Promise<AgentFact | null> {
        return this.factRepo.findOne({ where: { id } });
    }

    /**
     * Devuelve todos los facts registrados, ordenados por fecha descendente.
     */
    async findAll(): Promise<AgentFact[]> {
        return this.factRepo.find({
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * Busca un fact similar al claim dado, comparando embeddings semánticos y fecha reciente.
     */
    async findSimilarByEmbedding(claim: string): Promise<AgentFact | null> {
        const newEmbedding =
            await this.embeddingService.generateEmbedding(claim);

        const allFacts = await this.factRepo.find({
            where: { embedding: Not(IsNull()) },
            select: ['id', 'claim', 'normalizedClaim', 'status', 'updatedAt'],
        });

        let bestMatch: AgentFact | null = null;
        let highestSimilarity = 0;

        const THRESHOLD = env.EMBEDDING_SIMILARITY_THRESHOLD;
        const RECENT_DAYS = env.FACT_CHECK_CACHE_DAYS || 7;

        const recentThreshold = new Date();
        recentThreshold.setDate(recentThreshold.getDate() - RECENT_DAYS);

        for (const fact of allFacts) {
            if (!fact.embedding) {
                this.logger.warn(
                    `[Embedding] Empty vector for claim: ${fact.claim}`,
                );
                continue;
            }

            const sim = vectorSimilarity(fact.embedding, newEmbedding);
            const isRecent = new Date(fact.updatedAt) > recentThreshold;

            if (sim > highestSimilarity && sim >= THRESHOLD && isRecent) {
                highestSimilarity = sim;
                bestMatch = fact;
            }
        }

        return bestMatch;
    }
}
