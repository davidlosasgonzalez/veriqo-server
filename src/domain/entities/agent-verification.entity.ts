import { AgentReasoning } from './agent-reasoning.entity';

/**
 * Representa una comprobación factual externa asociada a un fact.
 */
export class AgentVerification {
    /** Identificador único de la verificación. */
    id!: string;

    /** Motor de búsqueda usado (opcional). */
    engineUsed?: string | null;

    /** Nivel de confianza en la verificación (opcional). */
    confidence?: number | null;

    /** Fuentes recuperadas en la búsqueda. */
    sourcesRetrieved!: string[];

    /** Fuentes utilizadas para la verificación. */
    sourcesUsed!: string[];

    /** Indica si la verificación está desactualizada. */
    isOutdated!: boolean;

    /** Razonamiento generado a partir de esta verificación (opcional). */
    reasoning?: AgentReasoning | null;

    /** ID del fact asociado (implícito en la relación inversa). */
    factId!: string;

    /** Fecha de creación de la verificación. */
    createdAt!: Date;

    /** Fecha de última actualización de la verificación. */
    updatedAt!: Date;
}
