import { AgentFact } from './agent-fact.entity';
import { AgentFindingSearchContext } from './agent-finding-search-context.entity';

/**
 * Representa un hallazgo detectado por el ValidatorAgent tras analizar un texto.
 */
export class AgentFinding {
    id!: string;
    claim!: string;
    needsFactCheck?: boolean | null;
    needsFactCheckReason?: string | null;
    embedding!: number[];
    createdAt!: Date;
    updatedAt!: Date;
    fact!: AgentFact;
    searchContext?: AgentFindingSearchContext | null;
}
