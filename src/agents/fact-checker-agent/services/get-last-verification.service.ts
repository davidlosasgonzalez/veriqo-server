import { Injectable } from '@nestjs/common';
import { AgentFact } from '@/core/database/entities/agent-fact.entity';
import { FactCheckerResultService } from '@/shared/facts/services/fact-checker-result.service';

@Injectable()
export class GetLastVerificationService {
    constructor(
        private readonly factCheckerResultService: FactCheckerResultService,
    ) {}

    /**
     * Devuelve el último resultado factual generado por el sistema.
     */
    async execute(): Promise<AgentFact | null> {
        return this.factCheckerResultService.execute();
    }
}
