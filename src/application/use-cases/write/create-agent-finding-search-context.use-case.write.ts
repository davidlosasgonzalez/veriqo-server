import { Inject, Injectable } from '@nestjs/common';
import { IAgentFindingSearchContextRepository } from '@/application/interfaces/agent-finding-search-context.interface';
import { AgentFindingSearchContextRepositoryToken } from '@/application/tokens/agent-finding-search-context.token';
import { AgentFindingSearchContext } from '@/domain/entities/agent-finding-search-context.entity';

/**
 * Caso de uso WRITE para crear un AgentFindingSearchContext asociado a un AgentFinding.
 */
@Injectable()
export class CreateAgentFindingSearchContextUseCaseWrite {
    constructor(
        @Inject(AgentFindingSearchContextRepositoryToken)
        private readonly contextRepo: IAgentFindingSearchContextRepository,
    ) {}

    /**
     * Crea el contexto de búsqueda asociado a un finding.
     *
     * @param input Datos estructurados para búsqueda factual.
     * @returns Contexto persistido.
     */
    async execute(input: {
        findingId: string;
        keywords: string[];
        synonyms: Record<string, string[]> | null;
        searchQuery: Record<string, string>;
        siteSuggestions?: string[] | null;
    }): Promise<AgentFindingSearchContext> {
        const now = new Date();
        const context = new AgentFindingSearchContext();

        context.findingId = input.findingId;
        context.keywords = input.keywords;
        context.synonyms = input.synonyms;
        context.searchQuery = input.searchQuery;
        context.siteSuggestions = input.siteSuggestions ?? null;
        context.createdAt = now;
        context.updatedAt = now;

        return this.contextRepo.save(context);
    }
}
