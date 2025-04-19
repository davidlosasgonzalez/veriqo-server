import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentSource } from '@/core/database/entities/agent-source.entity';
import { AgentVerification } from '@/core/database/entities/agent-verification.entity';
import { VerificationVerdict } from '@/shared/types/verification-verdict.type';

/**
 * Servicio para gestionar las verificaciones factual generadas por el sistema
 * y sus fuentes relacionadas.
 */
@Injectable()
export class AgentVerificationService {
    constructor(
        @InjectRepository(AgentVerification)
        private readonly verificationRepo: Repository<AgentVerification>,
        @InjectRepository(AgentSource)
        private readonly sourceRepo: Repository<AgentSource>,
    ) {}

    /**
     * Guarda una verificación factual y sus fuentes asociadas.
     *
     * @param agent Nombre del agente que generó la verificación
     * @param claim Afirmación evaluada
     * @param result Resultado de la verificación (true, false, etc.)
     * @param reasoning Razonamiento generado por el agente
     * @param sources Fuentes con URL, dominio y snippet
     * @param sourcesRetrieved Lista de URLs consideradas durante la búsqueda
     * @param sourcesUsed Lista de URLs utilizadas efectivamente para razonar
     * @param findingId ID del hallazgo asociado (opcional)
     */
    async saveVerification(
        agent: string,
        claim: string,
        result: AgentVerification['result'],
        reasoning: string,
        sources: {
            url: string;
            domain: string;
            snippet?: string;
        }[],
        sourcesRetrieved: string[],
        sourcesUsed: string[],
        findingId?: string,
    ): Promise<AgentVerification> {
        const verification = this.verificationRepo.create({
            agent,
            claim,
            result,
            reasoning,
            sourcesRetrieved,
            sourcesUsed,
            findingId,
        });

        const savedVerification =
            await this.verificationRepo.save(verification);

        const sourceEntities = sources.map((source) =>
            this.sourceRepo.create({
                verificationId: savedVerification.id,
                agent,
                claim,
                url: source.url,
                domain: source.domain,
                snippet: source.snippet ?? null,
            }),
        );

        await this.sourceRepo.save(sourceEntities);

        return savedVerification;
    }

    /**
     * Obtiene una verificación factual a partir de un claim.
     */
    async findByClaim(claim: string): Promise<AgentVerification | null> {
        return this.verificationRepo.findOne({
            where: { claim },
        });
    }

    /**
     * Devuelve un conteo de verificaciones por tipo de veredicto.
     */
    async countByVerdict(): Promise<Record<VerificationVerdict, number>> {
        const result = await this.verificationRepo
            .createQueryBuilder('v')
            .select('v.result', 'result')
            .addSelect('COUNT(*)', 'count')
            .groupBy('v.result')
            .getRawMany();

        return result.reduce(
            (acc, curr) => {
                acc[curr.result as VerificationVerdict] = Number(curr.count);
                return acc;
            },
            {} as Record<VerificationVerdict, number>,
        );
    }

    /**
     * Obtiene todas las fuentes utilizadas por los agentes en verificaciones.
     */
    async findAllSources(): Promise<AgentSource[]> {
        return this.sourceRepo.find({
            relations: ['verification'],
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * Obtiene todas las verificaciones existentes.
     */
    async findAll(): Promise<AgentVerification[]> {
        return this.verificationRepo.find({
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * Busca una verificación específica por ID.
     */
    async findById(id: string): Promise<AgentVerification | null> {
        return this.verificationRepo.findOne({
            where: { id },
        });
    }
}
