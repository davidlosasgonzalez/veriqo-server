import { Inject, Injectable } from '@nestjs/common';
import { IAgentFindingRepository } from '@/application/interfaces/agent-finding-repository.interface';
import { AgentFindingRepositoryToken } from '@/application/tokens/agent-finding-repository.token';
import { AgentFact } from '@/domain/entities/agent-fact.entity';
import { NormalizedClaim } from '@/shared/types/parsed-types/normalized-claim.type';

@Injectable()
export class FindFactByFindingClaimUseCaseRead {
    constructor(
        @Inject(AgentFindingRepositoryToken)
        private readonly agentFindingRepository: IAgentFindingRepository,
    ) {}

    /**
     * Busca un AgentFinding por su claim y devuelve el AgentFact vinculado, si lo hay.
     *
     * @param claim - Afirmación ya normalizada.
     * @returns AgentFact si existe, o null si no hay coincidencia previa.
     */
    async execute(claim: NormalizedClaim): Promise<AgentFact | null> {
        const finding = await this.agentFindingRepository.findByClaim(claim);

        return finding?.fact ?? null;
    }
}
