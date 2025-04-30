import {
    AgentFactCategory,
    AgentFactStatus,
} from '../types/enums/agent-fact.types';

/**
 * Contrato de creación de AgentFact a partir de un AgentFinding validado.
 * Define los parámetros necesarios para crear un nuevo `AgentFact` después de una validación.
 */
export interface CreateFactFromValidatedFindingParams {
    status: AgentFactStatus;
    category: AgentFactCategory;
    reasoning: string;
    summary?: string;
}
