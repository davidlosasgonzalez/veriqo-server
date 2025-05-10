import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { FindAllFindingsUseCase } from '../../use-cases/read/finding/find-all-findings.use-case';

import { FindAllFindingsQuery } from './find-all-findings.query';

import { Finding } from '@/agents/validator-agent/domain/entities/finding';

@QueryHandler(FindAllFindingsQuery)
export class FindAllFindingsHandler
    implements IQueryHandler<FindAllFindingsQuery>
{
    constructor(private readonly useCase: FindAllFindingsUseCase) {}

    async execute(_: FindAllFindingsQuery): Promise<Finding[]> {
        return this.useCase.execute();
    }
}
