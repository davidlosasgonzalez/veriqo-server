import { Expose, Transform } from 'class-transformer';
import { AgentFact } from './agent-fact.entity';
import { AgentReasoning } from './agent-reasoning.entity';

/**
 * Representa una comprobación factual externa asociada a un fact.
 */
export class AgentVerification {
    /* Identificador único de la verificación. */
    id!: string;

    /* Motor de búsqueda usado (opcional). */
    engineUsed?: string | null;

    /* Nivel de confianza en la verificación (opcional). */
    confidence?: number | null;

    /* Fuentes recuperadas en la búsqueda. */
    sourcesRetrieved!: string[];

    /* Fuentes utilizadas para la verificación. */
    sourcesUsed!: string[];

    /* Indica si la verificación está desactualizada. */
    isOutdated!: boolean;

    /* Razonamiento asociado (opcional). */
    reasoning?: AgentReasoning | null;

    /* Fact verificado (opcional). */
    @Expose()
    @Transform(({ value }) => {
        if (!value || Object.keys(value as object).length === 0) {
            return undefined;
        }

        return value;
    })
    fact?: AgentFact | null;

    /* Fecha de creación. */
    createdAt!: Date;

    /* Fecha de actualización. */
    updatedAt!: Date;
}
