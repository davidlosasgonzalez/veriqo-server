import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentPromptEntity } from '@/infrastructure/database/typeorm/entities/agent-prompt.entity';
import { AgentPromptRole } from '@/shared/types/enums/agent-prompt.types';

/**
 * Servicio para la gestión de prompts usados por los modelos LLM.
 */
@Injectable()
export class AgentPromptService {
    constructor(
        @InjectRepository(AgentPromptEntity)
        private readonly promptRepository: Repository<AgentPromptEntity>,
    ) {}

    /**
     * Recupera un prompt por tipo de tarea y rol específico.
     *
     * @param type - Tipo de tarea (por ejemplo, VALIDATOR_NORMALIZE_CLAIMS).
     * @param role - Rol del prompt (system, user, assistant, etc.).
     * @returns El prompt encontrado o null si no existe.
     */
    async findPromptByTypeAndRole(
        type: string,
        role: AgentPromptRole,
    ): Promise<AgentPromptEntity | null> {
        return await this.promptRepository.findOne({
            where: { type, role },
        });
    }

    /**
     * Recupera todos los prompts almacenados en base de datos.
     *
     * @returns Lista completa de prompts disponibles.
     */
    async findAll(): Promise<AgentPromptEntity[]> {
        return await this.promptRepository.find();
    }
}
