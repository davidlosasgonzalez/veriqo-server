import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentLog } from '@/database/entities/agent-log.entity';

@Injectable()
export class AgentLoggerService extends Logger {
    constructor(
        @InjectRepository(AgentLog)
        private readonly agentLogRepo: Repository<AgentLog>,
    ) {
        super();
    }

    async logUse(
        agentName: string,
        model: string,
        inputPrompt: string,
        outputResult: string,
        tokensInput: number,
        tokensOutput: number,
    ): Promise<void> {
        const log = this.agentLogRepo.create({
            agentName: agentName,
            model,
            inputPrompt: inputPrompt,
            outputResult: outputResult,
            tokensInput: tokensInput,
            tokensOutput: tokensOutput,
        });

        await this.agentLogRepo.save(log);
    }

    async getAllLogs(): Promise<AgentLog[]> {
        return this.agentLogRepo.find({
            order: { createdAt: 'DESC' },
        });
    }
}
