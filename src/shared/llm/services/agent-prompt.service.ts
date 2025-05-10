import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AgentPromptRole } from '@/shared/domain/enums/agent-prompt-role.enum';
import { AgentPromptOrmEntity } from '@/shared/infrastructure/entities/agent-prompt.orm-entity';

@Injectable()
export class AgentPromptService {
    constructor(
        @InjectRepository(AgentPromptOrmEntity)
        private readonly promptRepository: Repository<AgentPromptOrmEntity>,
    ) {}

    async findPromptByTypeAndRole(
        type: string,
        role: AgentPromptRole,
    ): Promise<AgentPromptOrmEntity | null> {
        return this.promptRepository.findOne({
            where: { type, role },
        });
    }

    async findAll(): Promise<AgentPromptOrmEntity[]> {
        return this.promptRepository.find();
    }
}
