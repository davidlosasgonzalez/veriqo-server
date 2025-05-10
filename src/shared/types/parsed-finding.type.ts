import { type FactCategory } from '../domain/enums/fact-category.enum';

/**
 * Representa una afirmación normalizada extraída de un texto por el modelo.
 * Es el resultado intermedio antes de persistir un AgentFinding.
 */
export type ParsedFinding = {
    claim: string;
    searchQuery: string;
    siteSuggestions?: string[];
    category: FactCategory;
    explanation?: string;
    needsFactCheckReason?: string;
};
