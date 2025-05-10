import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetFactByIdUseCase } from '../../use-cases/read/fact/get-fact-by-id.use-case';

import { GetFactByIdQuery } from './get-fact-by-id.query';

import { FactDto } from '@/shared/presentation/dto/fact.dto';

@QueryHandler(GetFactByIdQuery)
export class GetFactByIdHandler implements IQueryHandler<GetFactByIdQuery> {
    constructor(private readonly useCase: GetFactByIdUseCase) {}

    async execute(query: GetFactByIdQuery): Promise<FactDto> {
        return this.useCase.execute(query);
    }
}
