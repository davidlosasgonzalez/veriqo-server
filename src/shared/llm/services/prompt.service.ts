import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentPromptEntity } from '@/infrastructure/database/typeorm/entities/agent-prompt.entity';
import { AgentPromptRole } from '@/shared/types/parsed-types/agent-prompt.types';

/**
 * Servicio para la gestión de prompts usados por los modelos LLM.
 */
@Injectable()
export class PromptService {
    constructor(
        @InjectRepository(AgentPromptEntity)
        private readonly promptRepository: Repository<AgentPromptEntity>,
    ) {}

    /**
     * Busca un prompt por tipo de tarea (type) y rol específico (system, user, etc.).
     * @param type - Tipo de tarea (ej: VALIDATOR_NORMALIZE_CLAIMS, FACTCHECK_ANALYZE_STATUS).
     * @param role - Rol del prompt (system, user, etc.).
     * @returns El prompt encontrado o null.
     */
    async findPromptByTypeAndRole(
        type: string,
        role: AgentPromptRole,
    ): Promise<AgentPromptEntity | null> {
        return await this.promptRepository.findOne({
            where: {
                type,
                role,
            },
        });
    }

    /**
     * Busca todos los prompts asociados a un agente específico.
     * @param agent - Nombre del agente.
     * @returns Lista de prompts encontrados.
     */
    async findPromptsByAgent(agent: string): Promise<AgentPromptEntity[]> {
        return await this.promptRepository.find({
            where: {
                agent,
            },
        });
    }

    /**
     * Recupera todos los prompts disponibles.
     * @returns Lista completa de prompts.
     */
    async listAllPrompts(): Promise<AgentPromptEntity[]> {
        return await this.promptRepository.find();
    }
}
