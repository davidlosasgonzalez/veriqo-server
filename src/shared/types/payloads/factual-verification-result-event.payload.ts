import {
    AgentFactCategory,
    AgentFactStatus,
} from '@/shared/types/enums/agent-fact.types';

/**
 * Payload que se emite cuando se completa una verificación factual.
 * Este evento actualiza el estado y el razonamiento actual de un AgentFact.
 */
export interface FactualVerificationResultPayload {
    factId: string;
    claim: string;
    newCategory: AgentFactCategory;
    newStatus: AgentFactStatus;
    reasoning: {
        summary: string;
        content: string;
    };
}
