/**
 * Tipo crudo (raw) recibido desde el modelo LLM, antes de validación y casting.
 */
export type ValidatedClaimResultRaw = {
    status: string;
    category: string;
    reasoning?: string;
    needsFactCheckReason?: string | null;
    summary?: string;
    searchQuery?: Record<string, string>;
    siteSuggestions?: string[];
    confidence?: number;
    sources_used?: string[];
};
