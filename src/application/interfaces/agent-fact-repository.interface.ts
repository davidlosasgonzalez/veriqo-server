import { AgentFact } from '@/domain/entities/agent-fact.entity';
import {
    AgentFactCategory,
    AgentFactStatus,
} from '@/shared/types/agent-fact.types';

/**
 * Contrato de acceso a la persistencia de AgentFact.
 */
export interface IAgentFactRepository {
    /** Guarda un AgentFact. */
    save(fact: AgentFact): Promise<AgentFact>;

    /** Busca un AgentFact por ID. */
    findById(id: string): Promise<AgentFact | null>;

    /** Actualiza estado, categoría y razonamiento de un AgentFact tras verificación. */
    updateAfterVerification(params: {
        factId: string;
        newStatus: AgentFactStatus;
        newCategory: AgentFactCategory;
        newReasoning: {
            summary: string;
            content: string;
        };
    }): Promise<void>;
}
