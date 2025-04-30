import { AgentFindingSearchContext } from '@/domain/entities/agent-finding-search-context.entity';

/**
 * Contrato que define las operaciones disponibles para almacenar contextos de búsqueda asociados a findings.
 */
export interface IAgentFindingSearchContextRepository {
    /** Guarda un AgentFindingSearchContext. */
    save(
        context: AgentFindingSearchContext,
    ): Promise<AgentFindingSearchContext>;
}
