import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentFindingSearchContextEntity } from '@/infrastructure/database/typeorm/entities/agent-finding-search-context.entity';
import { AgentLogEntity } from '@/infrastructure/database/typeorm/entities/agent-log.entity';
import { AgentPromptEntity } from '@/infrastructure/database/typeorm/entities/agent-prompt.entity';

/**
 * Servicio para la creación y recuperación de logs de actividad de los agentes LLM.
 */
@Injectable()
export class AgentLogService {
    constructor(
        @InjectRepository(AgentLogEntity)
        private readonly logRepository: Repository<AgentLogEntity>,
    ) {}

    /**
     * Crea un nuevo log asociado a una interacción con un modelo LLM.
     *
     * @param params Datos necesarios para registrar el log.
     * @returns El log creado.
     */
    async create(params: {
        agentName: string;
        model: string;
        inputPrompt: string;
        outputResult: string;
        tokensInput?: number;
        tokensOutput?: number;
        elapsedTime?: number;
        prompt?: AgentPromptEntity | null;
    }): Promise<AgentLogEntity> {
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

        return await this.logRepository.save(log);
    }

    /**
     * Recupera todos los logs registrados, ordenados por fecha descendente.
     *
     * @returns Lista de AgentLogEntity
     */
    async findAll(): Promise<AgentLogEntity[]> {
        return this.logRepository.find({
            order: { createdAt: 'DESC' },
            relations: ['prompt'],
        });
    }
}
