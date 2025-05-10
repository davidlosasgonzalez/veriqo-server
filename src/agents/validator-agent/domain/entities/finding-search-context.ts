export class FindingSearchContext {
    constructor(
        private readonly id: string,
        private readonly searchQuery: Record<string, string>,
        private readonly createdAt: Date,
        private readonly updatedAt: Date,
        private readonly findingId?: string,
        private readonly siteSuggestions?: string[] | null,
    ) {
        if (!id) throw new Error('El contexto de búsqueda requiere un ID.');

        if (!searchQuery || Object.keys(searchQuery).length === 0) {
            throw new Error('El searchQuery no puede estar vacío.');
        }
    }

    getId(): string {
        return this.id;
    }

    getSearchQuery(): Record<string, string> {
        return this.searchQuery;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getUpdatedAt(): Date {
        return this.updatedAt;
    }

    getFindingId(): string | undefined {
        return this.findingId;
    }

    getSiteSuggestions(): string[] | null | undefined {
        return this.siteSuggestions;
    }
}
