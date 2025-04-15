import { AgentFindingCategory } from '@/database/entities/agent-findings.entity';

export type ValidationFinding = {
    id: string;
    claim: string;
    category: AgentFindingCategory;
    summary: string;
    explanation: string;
    suggestion: string;
    keywords?: string[];
    synonyms?: Record<string, string[]>;
    namedEntities?: string[];
    locations?: string[];
    searchQuery?: string;
    siteSuggestions?: string[];
    needsFactCheck: boolean;
    needsFactCheckReason?: string;
};
