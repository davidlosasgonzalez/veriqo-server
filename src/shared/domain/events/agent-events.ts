import { type FactCategory } from '../enums/fact-category.enum';
import { type FactStatus } from '../enums/fact-status.enum';

export interface FactualVerificationResultPayload {
    factId: string;
    claim: string;
    newCategory: FactCategory;
    newStatus: FactStatus;
    reasoning: {
        summary: string;
        content: string;
    };
}

export interface FactualCheckRequiredEventPayload {
    factId: string;
    findingId: string;
    claim: string;
    searchQuery: Record<string, string>;
    siteSuggestions: string[] | null;
}
