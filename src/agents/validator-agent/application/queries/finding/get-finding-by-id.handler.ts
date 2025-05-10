import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetFindingByIdUseCase } from '../../use-cases/read/finding/get-finding-by-id.use-case';

import { GetFindingByIdQuery } from './get-finding-by-id.use-query';

import { Finding } from '@/agents/validator-agent/domain/entities/finding';

@QueryHandler(GetFindingByIdQuery)
export class GetFindingByIdHandler
    implements IQueryHandler<GetFindingByIdQuery>
{
    constructor(private readonly useCase: GetFindingByIdUseCase) {}

    async execute(query: GetFindingByIdQuery): Promise<Finding> {
        return this.useCase.execute(query);
    }
}
