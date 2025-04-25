import { AgentFinding } from './agent-finding.entity';
import { AgentReasoning } from './agent-reasoning.entity';
import { AgentVerification } from './agent-verification.entity';
import {
    AgentFactCategory,
    AgentFactStatus,
} from '@/shared/types/agent-fact.types';

/**
 * Representa un hecho verificado por el sistema, ya sea internamente o mediante el agente factual.
 */
export class AgentFact {
    id!: string;
    status!: AgentFactStatus;
    category?: AgentFactCategory | null;
    createdAt!: Date;
    updatedAt!: Date;
    reasoning?: AgentReasoning | null;
    verifications?: AgentVerification[] | null;
    findings?: AgentFinding[];
}
