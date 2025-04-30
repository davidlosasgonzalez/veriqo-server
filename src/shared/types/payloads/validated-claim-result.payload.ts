import {
    AgentFactCategory,
    AgentFactStatus,
} from '@/shared/types/enums/agent-fact.types';

/**
 * Payload que representa el resultado de validar internamente una afirmación textual.
 * Se utiliza para encapsular tanto el estado factual como los metadatos relevantes
 * asociados al análisis de la afirmación realizada por el agente de validación.
 */
export interface ValidatedClaimResultPayload {
    status: AgentFactStatus;
    category: AgentFactCategory;
    reasoning?: string;
    needsFactCheckReason?: string | null;
    summary?: string;
    searchQuery?: Record<string, string>;
    siteSuggestions?: string[];
    searchResults?: Record<string, any>[];
}
