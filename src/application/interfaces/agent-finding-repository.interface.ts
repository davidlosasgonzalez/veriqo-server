import { AgentFinding } from '@/domain/entities/agent-finding.entity';

/**
 * Contrato que define las operaciones disponibles para almacenar y consultar hallazgos analizados.
 */
export interface IAgentFindingRepository {
    save(finding: AgentFinding): Promise<AgentFinding>;
    saveMany(findings: AgentFinding[]): Promise<void>;
    findById(id: string): Promise<AgentFinding | null>;
    findAll(): Promise<AgentFinding[]>;
    findByClaim(claim: string): Promise<AgentFinding | null>;
    findMostSimilarEmbedding(
        vector: number[],
        threshold: number,
    ): Promise<AgentFinding | null>;
}
