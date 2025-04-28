import { Injectable } from '@nestjs/common';

import { AgentVerification } from '@/domain/entities/agent-verification.entity';
import { AgentVerificationRepository } from '@/infrastructure/database/typeorm/repositories/agent-verification.repository';

/**
 * Caso de uso READ para recuperar una verificación específica por su ID.
 */
@Injectable()
export class GetVerificationByIdUseCaseRead {
    constructor(
        private readonly agentVerificationRepository: AgentVerificationRepository,
    ) {}

    /**
     * Busca una verificación por su ID único.
     *
     * @param id - Identificador UUID de la verificación.
     * @returns Verificación encontrada o null.
     */
    async execute(id: string): Promise<AgentVerification | null> {
        return this.agentVerificationRepository.findById(id);
    }
}
