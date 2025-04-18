import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, Not, IsNull } from 'typeorm';
import { env } from '@/config/env/env.config';
import { AgentFact } from '@/core/database/entities/agent-fact.entity';
import { OpenAIEmbeddingService } from '@/shared/embeddings/openai-embedding.service';
import { vectorSimilarity } from '@/shared/utils/embeddings/vector-similarity';

/**
 * Servicio responsable de gestionar los hechos verificados (`AgentFact`),
 * incluyendo creación, deduplicación semántica, y búsquedas eficientes.
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
     * Crea un fact nuevo o actualiza uno existente si ha cambiado el claim, status o las fuentes.
     * @param _agent Agente que solicita la creación (no se usa por ahora).
     * @param claim Afirmación original.
     * @param status Veredicto factual asignado.
     * @param sources Fuentes utilizadas para justificar el veredicto.
     * @param normalizedClaim Claim ya normalizado (opcional).
     * @returns `AgentFact` guardado o actualizado.
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

                return await this.factRepo.save(existing);
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

        return await this.factRepo.save(newFact);
    }

    /**
     * Busca un fact reciente por su claim normalizado.
     * @param normalized Claim transformado a forma canónica.
     * @returns El `AgentFact` si existe, o `null`.
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
     * Normaliza un claim de entrada y lo busca.
     * @param claim Afirmación en lenguaje natural.
     */
    async findByClaim(claim: string): Promise<AgentFact | null> {
        return this.findByNormalizedClaim(claim.toLowerCase().trim());
    }

    /**
     * Busca un fact por ID.
     * @param id UUID del `AgentFact`.
     */
    async findById(id: string): Promise<AgentFact | null> {
        return this.factRepo.findOne({ where: { id } });
    }

    /**
     * Devuelve todos los facts existentes en base de datos.
     */
    async findAll(): Promise<AgentFact[]> {
        return this.factRepo.find({
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * Ejecuta una búsqueda por similitud semántica con embeddings,
     * y devuelve el fact más cercano si supera el umbral de similitud.
     * @param claim Texto a evaluar.
     * @returns `AgentFact` más similar si es reciente y suficientemente cercano.
     */
    async execute(claim: string): Promise<AgentFact | null> {
        const newEmbedding =
            await this.embeddingService.generateEmbedding(claim);

        const allFacts = await this.factRepo.find({
            where: { embedding: Not(IsNull()) },
            select: [
                'id',
                'claim',
                'normalizedClaim',
                'status',
                'updatedAt',
                'embedding',
            ],
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
