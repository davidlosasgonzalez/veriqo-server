/**
 * Payload para crear un FindingSearchContext.
 */
export interface CreateFindingSearchContextPayload {
    findingId: string;
    searchQuery: Record<string, string>;
    siteSuggestions?: string[] | null;
}
