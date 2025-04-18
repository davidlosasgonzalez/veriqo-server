import { Injectable } from '@nestjs/common';
import { ExecuteFactCheckerDto } from '../dto/execute-fact-checker.dto';
import { AgentFact } from '@/core/database/entities/agent-fact.entity';
import { AgentFactService } from '@/shared/facts/services/agent-fact.service';

/**
 * Servicio para obtener un fact previamente verificado a partir de una afirmación textual (claim).
 */
@Injectable()
export class GetFactByClaimService {
    constructor(private readonly agentFactService: AgentFactService) {}

    async execute(
        executeFactCheckerDto: ExecuteFactCheckerDto,
    ): Promise<AgentFact | null> {
        return this.agentFactService.findByClaim(executeFactCheckerDto.claim);
    }
}
