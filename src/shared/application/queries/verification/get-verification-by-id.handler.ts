import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetVerificationByIdUseCase } from '../../use-cases/read/verification/get-verification-by-id.use-case';

import { GetVerificationByIdQuery } from './get-verification-by-id.query';

import { Verification } from '@/shared/domain/entities/verification';

@QueryHandler(GetVerificationByIdQuery)
export class GetVerificationByIdHandler
    implements IQueryHandler<GetVerificationByIdQuery>
{
    constructor(private readonly useCase: GetVerificationByIdUseCase) {}

    async execute(query: GetVerificationByIdQuery): Promise<Verification> {
        return this.useCase.execute(query);
    }
}
