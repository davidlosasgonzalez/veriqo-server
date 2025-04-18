import { Injectable } from '@nestjs/common';
import { AgentFinding } from '@/core/database/entities/agent-finding.entity';
import { AgentFindingService } from '@/shared/facts/services/agent-finding.service';

/**
 * Servicio que devuelve el historial completo de findings asociados
 * a un fact previamente verificado.
 */
@Injectable()
export class GetFactHistoryService {
    constructor(private readonly agentFindingService: AgentFindingService) {}

    async execute(factId: string): Promise<AgentFinding[]> {
        return this.agentFindingService.findAll();
    }
}
