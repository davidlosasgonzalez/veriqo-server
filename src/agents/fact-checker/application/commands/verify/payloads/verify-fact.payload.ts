export interface VerifyFactPayload {
    claim: string;
    context?: {
        factId: string;
        searchQuery?: Record<string, string>;
        siteSuggestions?: string[];
    };
}
