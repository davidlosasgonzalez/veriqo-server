/**
 * Representa un finding procesado por el modelo LLM en formato estructurado.
 */
export interface ParsedFinding {
    claim: string;
    normalizedClaim?: string;
    category: string;
    summary: string;
    explanation: string;
    suggestion: string;
    keywords?: string[];
    synonyms?: Record<string, string[]>;
    namedEntities?: string[];
    locations?: string[];
    siteSuggestions?: string[];
    searchQuery?: string;
    needsFactCheck?: boolean;
    needsFactCheckReason?: string;
}
