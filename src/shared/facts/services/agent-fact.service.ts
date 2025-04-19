import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, Not, IsNull } from 'typeorm';
import { env } from '@/config/env/env.config';
import { AgentFact } from '@/core/database/entities/agent-fact.entity';
import { OpenAIEmbeddingService } from '@/shared/embeddings/openai-embedding.service';
import { vectorSimilarity } from '@/shared/utils/embeddings/vector-similarity';

/**
 * Servicio responsable de gestionar los hechos verificados (`AgentFact`).
 * Incluye creación, deduplicación semántica, recuperación contextual y búsqueda por similitud.
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
     * Crea un nuevo `AgentFact` o actualiza uno existente si ha cambiado el claim, status o embedding.
     * @param _agent Nombre del agente creador (informativo).
     * @param claim Afirmación original en lenguaje natural.
     * @param status Veredicto factual (`true`, `false`, `possibly_true`, `unknown`).
     * @param normalizedClaim Versión canónica (opcional). Si no se proporciona, se genera.
     * @returns Fact creado o actualizado.
     */
    async create(
        _agent: string,
        claim: string,
        status: AgentFact['status'],
        normalizedClaim?: string,
    ): Promise<AgentFact> {
        const normalized =
            normalizedClaim?.trim().toLowerCase() || claim.toLowerCase().trim();

        const embedding = await this.embeddingService.generateEmbedding(claim);

        const existing = await this.factRepo.findOneBy({
            normalizedClaim: normalized,
        });

        const statusChanged = existing?.status !== status;
        const claimChanged = existing?.claim !== claim;

        if (existing && (statusChanged || claimChanged)) {
            existing.claim = claim;
            existing.status = status;
            existing.embedding = embedding;
            return await this.factRepo.save(existing);
        }

        if (existing) return existing;

        const newFact = this.factRepo.create({
            claim,
            normalizedClaim: normalized,
            status,
            embedding,
        });

        return await this.factRepo.save(newFact);
    }

    /**
     * Busca un fact por normalizedClaim sin aplicar ningún filtro de antigüedad.
     * Se utiliza por endpoints públicos como GET /facts/claim.
     * @param normalized Normalized claim.
     */
    async findByNormalizedClaimAny(
        normalized: string,
    ): Promise<AgentFact | null> {
        return this.factRepo.findOne({
            where: { normalizedClaim: normalized },
            order: { updatedAt: 'DESC' },
        });
    }

    /**
     * Normaliza un claim crudo y lo busca sin restricciones de antigüedad.
     * @param claim Texto original del usuario.
     */
    async findByClaim(claim: string): Promise<AgentFact | null> {
        const normalized = claim.toLowerCase().trim();
        return this.findByNormalizedClaimAny(normalized);
    }

    /**
     * Recupera un fact por su UUID.
     * @param id UUID del fact.
     */
    async findById(id: string): Promise<AgentFact | null> {
        return this.factRepo.findOne({ where: { id } });
    }

    /**
     * Devuelve todos los facts registrados, ordenados por fecha de creación.
     */
    async findAll(): Promise<AgentFact[]> {
        return this.factRepo.find({
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * Ejecuta una búsqueda por similitud semántica.
     * Compara embeddings del claim actual con los almacenados, y retorna el fact más similar si:
     * - Tiene embedding
     * - Es reciente (`updatedAt > FACT_CHECK_CACHE_DAYS`)
     * - La similitud supera el umbral `EMBEDDING_SIMILARITY_THRESHOLD`
     * @param claim Texto a verificar.
     * @returns Fact similar si existe, o `null`.
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
