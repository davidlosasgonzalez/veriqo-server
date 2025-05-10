import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { GetFindingByIdQuery } from '../../../queries/finding/get-finding-by-id.use-query';

import { Finding } from '@/agents/validator-agent/domain/entities/finding';
import { IFindingRepository } from '@/shared/domain/interfaces/finding-repository.interface';
import { FindingRepositoryToken } from '@/shared/tokens/finding-repository.token';

@Injectable()
export class GetFindingByIdUseCase {
    constructor(
        @Inject(FindingRepositoryToken)
        private readonly findingRepo: IFindingRepository,
    ) {}

    async execute(query: GetFindingByIdQuery): Promise<Finding> {
        const finding = await this.findingRepo.findById(query.payload.id);

        if (!finding) {
            throw new NotFoundException(
                `No se encontró ningún Finding con ID ${query.payload.id}`,
            );
        }

        return finding;
    }
}
