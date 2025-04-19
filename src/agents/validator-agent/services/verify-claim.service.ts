import { BadRequestException, Injectable } from '@nestjs/common';
import { ValidationFindingDto } from '../dto/validation-finding.dto';
import { env } from '@/config/env/env.config';
import { AgentFindingService } from '@/shared/facts/services/agent-finding.service';
import { LlmRouterService } from '@/shared/llm/llm-router.service';

@Injectable()
export class VerifyClaimService {
    constructor(
        private readonly agentFindingService: AgentFindingService,
        private readonly llmRouterService: LlmRouterService,
    ) {}

    /**
     * Ejecuta el proceso de validación sobre una o varias afirmaciones.
     * Utiliza un único análisis completo con Claude para detectar, normalizar
     * y categorizar múltiples afirmaciones en un solo paso.
     *
     * @param prompt Texto libre a analizar.
     * @returns Lista de findings generados tras el análisis.
     */
    async execute(prompt: string): Promise<ValidationFindingDto[]> {
        if (prompt.length > env.VALIDATOR_MAX_INPUT_CHARS) {
            throw new BadRequestException(
                `El texto supera el límite de ${env.VALIDATOR_MAX_INPUT_CHARS} caracteres. Divide el contenido en afirmaciones más pequeñas.`,
            );
        }

        const findings = await this.agentFindingService.analyzeText(prompt);

        return findings.map((f) => f.mapToDto());
    }
}
