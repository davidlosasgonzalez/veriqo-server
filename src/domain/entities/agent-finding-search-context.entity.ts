/**
 * Contiene la información auxiliar generada por el ValidatorAgent para facilitar búsquedas externas o comparaciones semánticas.
 */
export class AgentFindingSearchContext {
    id!: string;
    keywords!: string[];
    synonyms?: Record<string, string[]> | null;
    searchQuery!: Record<string, string>;
    siteSuggestions?: string[] | null;
    createdAt!: Date;
    updatedAt!: Date;
    findingId!: string;
}
