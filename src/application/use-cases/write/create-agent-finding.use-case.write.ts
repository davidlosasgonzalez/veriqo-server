import { Inject, Injectable } from '@nestjs/common';
import { IAgentFindingRepository } from '@/application/interfaces/agent-finding-repository.interface';
import { AgentFindingRepositoryToken } from '@/application/tokens/agent-finding-repository.token';
import { AgentFact } from '@/domain/entities/agent-fact.entity';
import { AgentFinding } from '@/domain/entities/agent-finding.entity';

/**
 * Caso de uso WRITE para crear un nuevo AgentFinding a partir de una afirmación normalizada.
 */
@Injectable()
export class CreateAgentFindingUseCaseWrite {
    constructor(
        @Inject(AgentFindingRepositoryToken)
        private readonly agentFindingRepository: IAgentFindingRepository,
    ) {}

    /**
     * Crea un AgentFinding inicial vinculado a su AgentFact correspondiente.
     *
     * @param claim - Afirmación ya normalizada.
     * @param fact - Fact asociado ya validado o creado.
     * @param embedding - Vector de embedding del claim.
     * @returns El AgentFinding creado y persistido.
     */
    async execute(
        claim: string,
        agentFact: AgentFact,
        embedding: number[],
    ): Promise<AgentFinding> {
        const now = new Date();
        const finding = new AgentFinding();

        finding.claim = claim;
        finding.fact = agentFact;
        finding.embedding = embedding;
        finding.createdAt = now;
        finding.updatedAt = now;

        return this.agentFindingRepository.save(finding);
    }
}
