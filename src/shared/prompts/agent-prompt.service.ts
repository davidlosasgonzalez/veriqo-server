import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentPrompt } from '@/database/entities/agent-prompt.entity';

@Injectable()
export class AgentPromptService {
    constructor(
        @InjectRepository(AgentPrompt)
        private readonly promptRepo: Repository<AgentPrompt>,
    ) {}

    async getPromptForAgent(agent: string): Promise<string> {
        const prompt = await this.promptRepo.findOneBy({ agent });
        if (!prompt) {
            throw new Error(`Prompt no encontrado para el agente "${agent}".`);
        }
        return prompt.prompt;
    }

    async getAllPrompts(): Promise<AgentPrompt[]> {
        return this.promptRepo.find({
            order: { agent: 'ASC' },
        });
    }
}
