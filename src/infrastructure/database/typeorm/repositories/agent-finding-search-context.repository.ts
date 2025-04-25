import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentFindingSearchContextEntity } from '@/infrastructure/database/typeorm/entities/agent-finding-search-context.entity';

@Injectable()
export class AgentFindingSearchContextRepository {
    constructor(
        @InjectRepository(AgentFindingSearchContextEntity)
        private readonly repo: Repository<AgentFindingSearchContextEntity>,
    ) {}

    async save(
        context: AgentFindingSearchContextEntity,
    ): Promise<AgentFindingSearchContextEntity> {
        return this.repo.save(context);
    }
}
