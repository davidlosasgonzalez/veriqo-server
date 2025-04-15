import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentLog } from './entities/agent-log.entity';

@Injectable()
export class DatabaseService {
    constructor(
        @InjectRepository(AgentLog)
        private agentLogRepository: Repository<AgentLog>,
    ) {}

    async createLog(
        agentName: string,
        model: string,
        inputPrompt: string,
        outputResult: string,
        tokensInput: number,
        tokensOutput: number,
    ): Promise<AgentLog> {
        const log = this.agentLogRepository.create({
            agentName,
            model,
            inputPrompt,
            outputResult,
            tokensInput,
            tokensOutput,
        });

        return this.agentLogRepository.save(log);
    }
}
