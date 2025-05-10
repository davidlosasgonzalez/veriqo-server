import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AgentLogOrmEntity } from '@/shared/infrastructure/entities/agent-log.orm-entity';
import { AgentPromptOrmEntity } from '@/shared/infrastructure/entities/agent-prompt.orm-entity';

@Injectable()
export class AgentLogService {
    constructor(
        @InjectRepository(AgentLogOrmEntity)
        private readonly logRepository: Repository<AgentLogOrmEntity>,
    ) {}

    async create(params: {
        agentName: string;
        model: string;
        inputPrompt: string;
        outputResult: string;
        tokensInput?: number;
        tokensOutput?: number;
        elapsedTime?: number;
        prompt?: AgentPromptOrmEntity | null;
    }): Promise<AgentLogOrmEntity> {
        const now = new Date();
        const log = this.logRepository.create({
            agentName: params.agentName,
            model: params.model,
            inputPrompt: params.inputPrompt,
            outputResult: params.outputResult,
            tokensInput: params.tokensInput ?? 0,
            tokensOutput: params.tokensOutput ?? 0,
            elapsedTime: params.elapsedTime ?? null,
            createdAt: now,
            prompt: params.prompt ?? null,
        });

        return this.logRepository.save(log);
    }

    async findAll(): Promise<AgentLogOrmEntity[]> {
        return this.logRepository.find({
            order: { createdAt: 'DESC' },
            relations: ['prompt'],
        });
    }
}
