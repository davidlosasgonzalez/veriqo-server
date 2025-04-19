import { Injectable, NotFoundException } from '@nestjs/common';
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

    /**
     * Recupera un prompt específico desde base de datos, según agente y clave.
     *
     * @param agent Nombre del agente (ej: 'validator_agent').
     * @param key Clave del prompt (ej: 'VALIDATOR_NORMALIZE_CLAIM').
     * @returns Objeto AgentPrompt con el contenido del prompt.
     * @throws NotFoundException si no existe.
     */
    async getPrompt(agent: string, key: string): Promise<AgentPrompt> {
        const prompt = await this.promptRepo.findOneBy({ agent, key });

        if (!prompt) {
            throw new NotFoundException(
                `No se encontró el prompt para el agente '${agent}' con la clave '${key}'.`,
            );
        }

        return prompt;
    }

    /**
     * Devuelve todos los prompts disponibles, ordenados por agente.
     */
    async findAllPrompts(): Promise<AgentPrompt[]> {
        return this.promptRepo.find({
            order: { agent: 'ASC' },
        });
    }

    /**
     * Devuelve todos los eventos registrados, ordenados cronológicamente.
     */
    async findAllEvents(): Promise<AgentEvent[]> {
        return this.eventRepo.find({ order: { createdAt: 'DESC' } });
    }
}
