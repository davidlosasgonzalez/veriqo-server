import { Injectable } from '@nestjs/common';
import { ValidationFindingDto } from '../dto/validation-finding.dto';
import { AgentFindingService } from '@/shared/facts/services/agent-finding.service';

/**
 * Servicio para verificar una afirmación textual mediante el ValidatorAgent.
 */
@Injectable()
export class VerifyClaimService {
    constructor(private readonly agentFindingService: AgentFindingService) {}

    /**
     * Ejecuta el proceso de validación sobre una afirmación (prompt).
     * @param prompt Afirmación a validar.
     * @returns Lista de findings generados tras el análisis.
     */
    async execute(prompt: string): Promise<ValidationFindingDto[]> {
        const findings = await this.agentFindingService.analyzeText(prompt);
        return findings.map((f) => f.mapToDto());
    }
}
