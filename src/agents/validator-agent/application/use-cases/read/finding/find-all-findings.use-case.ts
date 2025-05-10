import { Inject, Injectable } from '@nestjs/common';

import { Finding } from '@/agents/validator-agent/domain/entities/finding';
import { IFindingRepository } from '@/shared/domain/interfaces/finding-repository.interface';
import { FindingRepositoryToken } from '@/shared/tokens/finding-repository.token';

@Injectable()
export class FindAllFindingsUseCase {
    constructor(
        @Inject(FindingRepositoryToken)
        private readonly findingRepo: IFindingRepository,
    ) {}

    async execute(): Promise<Finding[]> {
        return this.findingRepo.findAll();
    }
}
