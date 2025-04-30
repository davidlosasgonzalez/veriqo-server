import { AgentVerification } from '@/domain/entities/agent-verification.entity';

/**
 * Contrato de acceso a la persistencia de AgentVerification.
 */
export interface IAgentVerificationRepository {
    /** Guarda una AgentVerification. */
    save(verification: AgentVerification): Promise<AgentVerification>;

    /** Busca una AgentVerification por ID. */
    findById(id: string): Promise<AgentVerification | null>;
}
