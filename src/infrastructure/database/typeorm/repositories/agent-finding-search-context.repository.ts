import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentFindingSearchContextEntity } from '@/infrastructure/database/typeorm/entities/agent-finding-search-context.entity';

/**
 * Repositorio para la gestión de AgentFindingSearchContext.
 */
@Injectable()
export class AgentFindingSearchContextRepository {
    constructor(
        @InjectRepository(AgentFindingSearchContextEntity)
        private readonly agentFindingSearchContextRepo: Repository<AgentFindingSearchContextEntity>,
    ) {}

    /**
     * Guarda un contexto de búsqueda en base de datos.
     */
    async save(
        context: AgentFindingSearchContextEntity,
    ): Promise<AgentFindingSearchContextEntity> {
        return this.agentFindingSearchContextRepo.save(context);
    }
}
