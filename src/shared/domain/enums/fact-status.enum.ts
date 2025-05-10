/**
 * Estados posibles en los que se puede encontrar la verificación de un hecho por parte de un agente.
 */
export const FACT_STATUS = {
    FACT_CHECKING: 'fact_checking',
    MATCHED: 'matched',
    VALIDATED: 'validated',
    REJECTED: 'rejected',
    ERROR: 'error',
} as const;

export type FactStatus = (typeof FACT_STATUS)[keyof typeof FACT_STATUS];
