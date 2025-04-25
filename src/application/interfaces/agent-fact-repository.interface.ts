import { AgentFact } from '@/domain/entities/agent-fact.entity';

/**
 * Contrato de acceso a la persistencia de AgentFact.
 */
export interface IAgentFactRepository {
    save(fact: AgentFact): Promise<AgentFact>;
    findById(id: string): Promise<AgentFact | null>;
}
