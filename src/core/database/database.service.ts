import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAgentLogDto } from './dto/create-agent-log.dto';
import { AgentLog } from './entities/agent-log.entity';

@Injectable()
export class DatabaseService {
    constructor(
        @InjectRepository(AgentLog)
        private readonly agentLogRepository: Repository<AgentLog>,
    ) {}

    /**
     * Persiste un nuevo log de actividad técnica generado por un agente.
     *
     * @param createAgentLogDto DTO con los datos del log (modelo, prompt, output, etc.)
     * @returns Log creado y persistido en la base de datos
     */
    async createLog(createAgentLogDto: CreateAgentLogDto): Promise<AgentLog> {
        const log = this.agentLogRepository.create(createAgentLogDto);
        return this.agentLogRepository.save(log);
    }
}
