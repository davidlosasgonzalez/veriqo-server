import { AgentFactCategory, AgentFactStatus } from '../types/agent-fact.types';

/**
 * Contrato de creación de AgentFact a partir de un AgentFinding validado.
 */
export interface CreateFactFromValidatedFindingParams {
    status: AgentFactStatus;
    category: AgentFactCategory;
    reasoning: string;
    summary?: string;
}
