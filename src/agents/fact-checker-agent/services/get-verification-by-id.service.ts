import { Injectable, NotFoundException } from '@nestjs/common';
import { AgentVerification } from '@/core/database/entities/agent-verification.entity';
import { AgentVerificationService } from '@/shared/facts/services/agent-verification.service';

/**
 * Servicio para recuperar una verificación factual específica por su ID.
 *
 * Este servicio busca en la base de datos una instancia de `AgentVerification`
 * mediante su identificador único. Si no se encuentra, lanza una excepción 404.
 *
 * @param id - Identificador UUID de la verificación a recuperar.
 * @returns La entidad `AgentVerification` correspondiente.
 * @throws NotFoundException - Si no se encuentra la verificación con el ID dado.
 */
@Injectable()
export class GetVerificationByIdService {
    constructor(
        private readonly agentVerificationService: AgentVerificationService,
    ) {}

    async execute(id: string): Promise<AgentVerification> {
        const verification = await this.agentVerificationService.findById(id);
        if (!verification) {
            throw new NotFoundException(
                `No se encontró la verificación con ID: ${id}`,
            );
        }
        return verification;
    }
}
