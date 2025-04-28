import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAgentFindingSearchContextRepository } from '@/application/interfaces/agent-finding-search-context-repository.interface';
import { AgentFindingSearchContextRepositoryToken } from '@/application/tokens/agent-finding-search-context.token';
import { AgentFindingSearchContext } from '@/domain/entities/agent-finding-search-context.entity';
import { AgentFindingSearchContextEntity } from '@/infrastructure/database/typeorm/entities/agent-finding-search-context.entity';
import { AgentFindingEntity } from '@/infrastructure/database/typeorm/entities/agent-finding.entity';

/**
 * Caso de uso WRITE para crear un AgentFindingSearchContext asociado a un AgentFinding.
 */
@Injectable()
export class CreateAgentFindingSearchContextUseCaseWrite {
    constructor(
        @Inject(AgentFindingSearchContextRepositoryToken)
        private readonly contextRepo: IAgentFindingSearchContextRepository,

        @InjectRepository(AgentFindingEntity)
        private readonly agentFindingRepo: Repository<AgentFindingEntity>,
    ) {}

    /**
     * Crea el contexto de búsqueda asociado a un finding.
     *
     * @param input - Datos estructurados para búsqueda factual.
     * @returns Contexto persistido.
     */
    async execute(input: {
        findingId: string;
        keywords: string[];
        synonyms: Record<string, string[]> | null;
        searchQuery: Record<string, string>;
        siteSuggestions?: string[] | null;
        searchResults?: Record<string, any>[] | null;
    }): Promise<AgentFindingSearchContext> {
        const now = new Date();
        const findingEntity = await this.agentFindingRepo.findOne({
            where: { id: input.findingId },
        });

        if (!findingEntity) {
            throw new Error(
                `No se encontró ningún AgentFindingEntity con ID ${input.findingId}`,
            );
        }

        const contextEntity = new AgentFindingSearchContextEntity();

        contextEntity.finding = findingEntity;
        contextEntity.keywords = input.keywords;
        contextEntity.synonyms = input.synonyms;
        contextEntity.searchQuery = input.searchQuery;
        contextEntity.siteSuggestions = input.siteSuggestions ?? null;
        contextEntity.searchResults = input.searchResults ?? null;
        contextEntity.createdAt = now;
        contextEntity.updatedAt = now;

        const savedContextEntity =
            await this.agentFindingRepo.manager.save(contextEntity);
        const context = new AgentFindingSearchContext();

        context.id = savedContextEntity.id;
        context.findingId = savedContextEntity.finding.id;
        context.keywords = savedContextEntity.keywords;
        context.synonyms = savedContextEntity.synonyms ?? null;
        context.searchQuery = savedContextEntity.searchQuery;
        context.siteSuggestions = savedContextEntity.siteSuggestions ?? null;
        context.searchResults = savedContextEntity.searchResults ?? null;
        context.createdAt = savedContextEntity.createdAt;
        context.updatedAt = savedContextEntity.updatedAt;

        return context;
    }
}
