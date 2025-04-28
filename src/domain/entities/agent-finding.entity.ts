import { AgentFact } from './agent-fact.entity';
import { AgentFindingSearchContext } from './agent-finding-search-context.entity';

/**
 * Representa un hallazgo detectado por el ValidatorAgent tras analizar un texto.
 */
export class AgentFinding {
    /* Identificador único del hallazgo. */
    id!: string;

    /* Claim detectado en el texto. */
    claim!: string;

    /* Motivo para solicitar fact-checking. */
    needsFactCheckReason?: string | null;

    /* Embedding vectorial del claim. */
    embedding!: number[];

    /* Fact relacionado al hallazgo. */
    fact!: AgentFact;

    /* Contexto de búsqueda asociado (opcional). */
    searchContext?: AgentFindingSearchContext | null;

    /* Fecha de creación. */
    createdAt!: Date;

    /* Fecha de actualización. */
    updatedAt!: Date;
}
