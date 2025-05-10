import { type FactCategory } from '@/shared/domain/enums/fact-category.enum';
import { type FactStatus } from '@/shared/domain/enums/fact-status.enum';

export interface ValidatedClaimResultPayload {
    status: FactStatus;
    category: FactCategory;
    reasoning?: string;
    needsFactCheckReason?: string | null;
    summary?: string;
    searchQuery?: Record<string, string>;
    siteSuggestions?: string[];
}
