import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentFact } from '@/core/database/entities/agent-fact.entity';

/**
 * Servicio que expone el último resultado factual registrado por el sistema,
 * independientemente del agente o claim de origen.
 */
@Injectable()
export class FactCheckerResultService {
    constructor(
        @InjectRepository(AgentFact)
        private readonly factRepository: Repository<AgentFact>,
    ) {}

    /**
     * Obtiene el último `AgentFact` registrado en base de datos.
     * Útil para debugging, observabilidad o vistas administrativas.
     *
     * @returns Último fact verificado o `null` si aún no hay ninguno.
     */
    async execute(): Promise<AgentFact | null> {
        const fact = await this.factRepository.findOne({
            where: {},
            order: { createdAt: 'DESC' },
        });

        if (!fact) return null;

        const { embedding, ...rest } = fact;
        return rest;
    }
}
