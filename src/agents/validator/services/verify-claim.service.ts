import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';

import { VerifyClaimDto } from '../dto/verify-claim.dto';
import { IAgentFactRepository } from '@/application/interfaces/agent-fact-repository.interface';
import { IAgentFindingRepository } from '@/application/interfaces/agent-finding-repository.interface';
import { AgentFactRepositoryToken } from '@/application/tokens/agent-fact-repository.token';
import { AgentFindingRepositoryToken } from '@/application/tokens/agent-finding-repository.token';
import { VerifyClaimUseCaseWrite } from '@/application/use-cases/write/verify-claim.use-case.write';
import { AgentFact } from '@/domain/entities/agent-fact.entity';
import { AgentFinding } from '@/domain/entities/agent-finding.entity';

/**
 * Servicio de fachada que conecta el controlador con los casos de uso de verificación de claims y acceso a datos.
 */
@Injectable()
export class VerifyClaimService {
    constructor(
        private readonly verifyClaim: VerifyClaimUseCaseWrite,

        @Inject(AgentFactRepositoryToken)
        private readonly agentFactRepository: IAgentFactRepository,

        @Inject(AgentFindingRepositoryToken)
        private readonly agentFindingRepository: IAgentFindingRepository,
    ) {}

    /**
     * Analiza y verifica un texto que contiene una o más afirmaciones.
     *
     * @param verifyClaimDto DTO con el texto original del claim.
     * @returns Lista de AgentFact generados tras el proceso de validación.
     */
    async analyze(verifyClaimDto: VerifyClaimDto): Promise<AgentFact[]> {
        return this.verifyClaim.execute(verifyClaimDto);
    }

    /**
     * Devuelve un hallazgo completo por su ID.
     *
     * @param id Identificador único del AgentFinding.
     */
    async getFindingById(id: string): Promise<AgentFinding> {
        const finding = await this.agentFindingRepository.findById(id);

        if (!finding) {
            throw new Error(`No se encontró ningún AgentFinding con ID ${id}`);
        }

        return finding;
    }

    /**
     * Lista todos los hallazgos registrados en el sistema.
     */
    async getAllFindings(): Promise<AgentFinding[]> {
        return this.agentFindingRepository.findAll();
    }

    /**
     * Devuelve un fact por su ID, si existe.
     *
     * @param id Identificador único del AgentFact.
     */
    async getFactById(id: string): Promise<AgentFact> {
        const fact = await this.agentFactRepository.findById(id);

        if (!fact) {
            throw new Error(`No se encontró ningún AgentFact con ID ${id}`);
        }

        return fact;
    }

    /**
     * Busca un hallazgo existente por claim exacto (ya normalizado).
     * Si existe un AgentFinding asociado a ese claim, se devuelve con su AgentFact incluido.
     *
     * @param claim Claim ya normalizado a buscar.
     * @returns El AgentFinding si existe, o null si no hay coincidencia exacta.
     */
    async getFindingByClaim(claim: string): Promise<AgentFinding | null> {
        return this.agentFindingRepository.findByClaim(claim);
    }
}
