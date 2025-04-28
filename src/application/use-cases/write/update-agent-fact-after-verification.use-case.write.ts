import { Inject, Injectable } from '@nestjs/common';
import { IAgentFactRepository } from '@/application/interfaces/agent-fact-repository.interface';
import { AgentFactRepositoryToken } from '@/application/tokens/agent-fact-repository.token';
import {
    AgentFactCategory,
    AgentFactStatus,
} from '@/shared/types/agent-fact.types';

/**
 * Caso de uso WRITE para actualizar el estado y el razonamiento actual de un AgentFact tras una verificación factual.
 */
@Injectable()
export class UpdateAgentFactAfterVerificationUseCaseWrite {
    constructor(
        @Inject(AgentFactRepositoryToken)
        private readonly agentFactRepository: IAgentFactRepository,
    ) {}

    /**
     * Actualiza un AgentFact con un nuevo estado y un nuevo razonamiento.
     *
     * @param params - Objeto que contiene el ID del fact, el nuevo estado y el razonamiento actualizado.
     */
    async execute(params: {
        factId: string;
        newStatus: string;
        newCategory: string;
        newReasoning: {
            summary: string;
            content: string;
        };
    }): Promise<void> {
        await this.agentFactRepository.updateAfterVerification({
            factId: params.factId,
            newStatus: params.newStatus as AgentFactStatus,
            newCategory: params.newCategory as AgentFactCategory,
            newReasoning: {
                summary: params.newReasoning.summary,
                content: params.newReasoning.content,
            },
        });
    }
}
