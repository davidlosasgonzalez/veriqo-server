import { Inject, Injectable } from '@nestjs/common';
import { IAgentFactRepository } from '@/application/interfaces/agent-fact-repository.interface';
import { AgentFactRepositoryToken } from '@/application/tokens/agent-fact-repository.token';
import {
    AgentFactCategory,
    AgentFactStatus,
} from '@/shared/types/enums/agent-fact.types';

/**
 * Caso de uso WRITE para actualizar el estado y categoría de un AgentFact tras una verificación factual.
 */
@Injectable()
export class UpdateAgentFactAfterVerificationUseCaseWrite {
    constructor(
        @Inject(AgentFactRepositoryToken)
        private readonly agentFactRepository: IAgentFactRepository,
    ) {}

    /**
     * Actualiza el estado y categoría de un AgentFact.
     *
     * @param params - Contiene el ID del fact, su nuevo estado y categoría.
     */
    async execute(params: {
        factId: string;
        newStatus: AgentFactStatus;
        newCategory: AgentFactCategory;
    }): Promise<void> {
        await this.agentFactRepository.updateStatusAndCategory({
            factId: params.factId,
            newStatus: params.newStatus,
            newCategory: params.newCategory,
        });
    }
}
