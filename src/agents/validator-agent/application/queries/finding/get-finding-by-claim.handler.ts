import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetFindingByClaimUseCase } from '../../use-cases/read/finding/get-finding-by-claim.use-case';

import { GetFindingByClaimQuery } from './get-finding-by-claim.query';

import { Finding } from '@/agents/validator-agent/domain/entities/finding';

@QueryHandler(GetFindingByClaimQuery)
export class GetFindingByClaimHandler
    implements IQueryHandler<GetFindingByClaimQuery>
{
    constructor(private readonly useCase: GetFindingByClaimUseCase) {}

    async execute(query: GetFindingByClaimQuery): Promise<Finding> {
        return this.useCase.execute(query);
    }
}
