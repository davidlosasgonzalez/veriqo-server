import { AgentFinding } from '@/domain/entities/agent-finding.entity';

/**
 * Contrato que define las operaciones disponibles para almacenar y consultar hallazgos analizados.
 */
export interface IAgentFindingRepository {
    /** Guarda un AgentFinding. */
    save(finding: AgentFinding): Promise<AgentFinding>;

    /** Guarda múltiples AgentFinding a la vez. */
    saveMany(findings: AgentFinding[]): Promise<void>;

    /** Busca un AgentFinding por ID. */
    findById(id: string): Promise<AgentFinding | null>;

    /** Devuelve todos los AgentFinding almacenados. */
    findAll(): Promise<AgentFinding[]>;

    /** Busca un AgentFinding por claim exacto. */
    findByClaim(claim: string): Promise<AgentFinding | null>;

    /** Busca el AgentFinding con embedding más similar que supere un umbral. */
    findMostSimilarEmbedding(
        vector: number[],
        threshold: number,
    ): Promise<AgentFinding | null>;
}
