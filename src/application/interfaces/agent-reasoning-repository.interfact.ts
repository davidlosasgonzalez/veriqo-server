import { AgentReasoning } from '@/domain/entities/agent-reasoning.entity';

/**
 * Contrato para almacenar y consultar razonamientos generados por los agentes.
 */
export interface IAgentReasoningRepository {
    /** Guarda un razonamiento y lo devuelve persistido. */
    save(reasoning: AgentReasoning): Promise<AgentReasoning>;
}
