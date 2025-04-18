import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentEvent } from '@/core/database/entities/agent-event.entity';
import { AgentPrompt } from '@/core/database/entities/agent-prompt.entity';

@Injectable()
export class AgentPromptService {
    constructor(
        @InjectRepository(AgentPrompt)
        private readonly promptRepo: Repository<AgentPrompt>,
        @InjectRepository(AgentEvent)
        private readonly eventRepo: Repository<AgentEvent>,
    ) {}

    async findPromptByAgent(agent: string): Promise<string> {
        const prompt = await this.promptRepo.findOneBy({ agent });

        if (!prompt) {
            throw new NotFoundException(
                `No se encontró el prompt para el agente "${agent}"`,
            );
        }

        return prompt.prompt;
    }

    async findAllPrompts(): Promise<AgentPrompt[]> {
        return this.promptRepo.find({
            order: { agent: 'ASC' },
        });
    }

    async findAllEvents(): Promise<AgentEvent[]> {
        return this.eventRepo.find({ order: { createdAt: 'DESC' } });
    }
}
