import { Inject, Injectable } from '@nestjs/common';
import { IAgentFactRepository } from '@/application/interfaces/agent-fact-repository.interface';
import { AgentFactRepositoryToken } from '@/application/tokens/agent-fact-repository.token';
import { AgentFact } from '@/domain/entities/agent-fact.entity';
import {
    AgentFactStatus,
    AgentFactCategory,
} from '@/shared/types/agent-fact.types';
import { NormalizedClaim } from '@/shared/types/parsed-types/normalized-claim.type';

/**
 * Caso de uso WRITE para crear un nuevo AgentFact desde un claim normalizado.
 */
@Injectable()
export class CreateAgentFactUseCaseWrite {
    constructor(
        @Inject(AgentFactRepositoryToken)
        private readonly agentFactRepository: IAgentFactRepository,
    ) {}

    /**
     * Crea un AgentFact con estado, categoría y claim ya normalizado.
     *
     * @param data - Objeto con estado, categoría y claim.
     * @returns AgentFact creado y persistido.
     */
    async execute(data: {
        claim: NormalizedClaim;
        status: AgentFactStatus;
        category: AgentFactCategory;
    }): Promise<AgentFact> {
        const now = new Date();
        const fact = new AgentFact();

        fact.status = data.status;
        fact.category = data.category;
        fact.createdAt = now;
        fact.updatedAt = now;

        return this.agentFactRepository.save(fact);
    }
}
