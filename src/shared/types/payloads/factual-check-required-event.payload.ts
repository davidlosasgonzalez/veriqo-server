/**
 * Payload emitido cuando se requiere verificación factual externa.
 * Este payload incluye los datos necesarios para realizar una verificación en una fuente externa.
 */
export interface FactualCheckRequiredEventPayload {
    factId: string;
    findingId: string;
    claim: string;
    searchQuery: Record<string, string>;
    siteSuggestions: string[] | null;
    searchResults?: Record<string, any>[] | null;
}
