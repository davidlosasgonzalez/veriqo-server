import { AgentFinding } from './agent-finding.entity';
import { AgentReasoning } from './agent-reasoning.entity';
import { AgentVerification } from './agent-verification.entity';
import {
    AgentFactCategory,
    AgentFactStatus,
} from '@/shared/types/enums/agent-fact.types';

/**
 * Representa un hecho verificado por el sistema, ya sea internamente o mediante el agente factual.
 */
export class AgentFact {
    /** Identificador único del fact. */
    id!: string;

    /** Estado factual del fact. */
    status!: AgentFactStatus;

    /** Categoría semántica asociada al fact. */
    category!: AgentFactCategory;

    /** Verificaciones externas asociadas. */
    verifications?: AgentVerification[];

    /** Razonamientos generados directamente desde el fact (sin verificación externa). */
    reasonings?: AgentReasoning[];

    /** Hallazgos (findings) asociados al fact. */
    findings?: AgentFinding[];

    /** Fecha de creación del fact. */
    createdAt!: Date;

    /** Fecha de última actualización del fact. */
    updatedAt!: Date;
}
