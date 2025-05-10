import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { GetFindingByClaimQuery } from '../../../queries/finding/get-finding-by-claim.query';

import { Finding } from '@/agents/validator-agent/domain/entities/finding';
import { IFindingRepository } from '@/shared/domain/interfaces/finding-repository.interface';
import { FindingRepositoryToken } from '@/shared/tokens/finding-repository.token';

@Injectable()
export class GetFindingByClaimUseCase {
    constructor(
        @Inject(FindingRepositoryToken)
        private readonly findingRepo: IFindingRepository,
    ) {}

    async execute(query: GetFindingByClaimQuery): Promise<Finding> {
        const finding = await this.findingRepo.findByClaim(query.payload.claim);

        if (!finding) {
            throw new NotFoundException(
                `No se encontró ningún Finding con claim "${query.payload.claim}"`,
            );
        }

        return finding;
    }
}
