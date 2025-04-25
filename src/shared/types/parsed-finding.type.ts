import { AgentFactCategory } from './agent-fact.types';

/**
 * Representa una afirmación normalizada extraída de un texto por el modelo.
 * Es el resultado intermedio antes de persistir un AgentFinding.
 */
export type ParsedFinding = {
    claim: string;
    keywords?: string[];
    synonyms?: Record<string, string[]>;
    searchQuery: string;
    siteSuggestions?: string[];
    category?: AgentFactCategory;
    explanation?: string;
    needsFactCheck?: boolean;
    needsFactCheckReason?: string;
};
