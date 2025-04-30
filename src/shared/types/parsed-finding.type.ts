import { AgentFactCategory } from './enums/agent-fact.types';

/**
 * Representa una afirmación normalizada extraída de un texto por el modelo.
 * Es el resultado intermedio antes de persistir un AgentFinding.
 */
export type ParsedFinding = {
    claim: string;
    searchQuery: string;
    siteSuggestions?: string[];
    category: AgentFactCategory;
    explanation?: string;
    needsFactCheckReason?: string;
};
