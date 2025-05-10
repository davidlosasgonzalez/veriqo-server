/**
 * Categorías para clasificar la naturaleza de un hecho identificado por el agente.
 */
export const FACT_CATEGORY = {
    FACTUAL: 'factual',
    LOGICAL: 'logical',
    SEMANTIC: 'semantic',
    UNSUPPORTED: 'unsupported',
    SYNTACTIC: 'syntactic',
    OPINION: 'opinion',
    IRRELEVANT: 'irrelevant',
    OTHER: 'other',
} as const;

export type FactCategory = (typeof FACT_CATEGORY)[keyof typeof FACT_CATEGORY];
