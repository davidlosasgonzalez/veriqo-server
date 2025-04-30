/**
 * Estados posibles en los que se puede encontrar la verificación de un hecho por parte de un agente.
 */
export enum AgentFactStatus {
    FACT_CHECKING = 'fact_checking',
    MATCHED = 'matched',
    VALIDATED = 'validated',
    REJECTED = 'rejected',
    ERROR = 'error',
}

/**
 * Categorías para clasificar la naturaleza de un hecho identificado por el agente.
 */
export enum AgentFactCategory {
    FACTUAL = 'factual',
    LOGICAL = 'logical',
    SEMANTIC = 'semantic',
    UNSUPPORTED = 'unsupported',
    SYNTACTIC = 'syntactic',
    OPINION = 'opinion',
    IRRELEVANT = 'irrelevant',
    OTHER = 'other',
}
