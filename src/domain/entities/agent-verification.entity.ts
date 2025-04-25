import { AgentFact } from './agent-fact.entity';
import { AgentReasoning } from './agent-reasoning.entity';

/**
 * Representa una comprobación factual externa asociada a un AgentFact.
 */
export class AgentVerification {
    id!: string;
    method!: string;
    confidence!: number;
    sourcesRetrieved!: string[];
    sourcesUsed!: string[];
    sourceType!: string;
    isOutdated!: boolean;
    createdAt!: Date;
    updatedAt!: Date;
    reasoning!: AgentReasoning;
    fact!: AgentFact;
}
