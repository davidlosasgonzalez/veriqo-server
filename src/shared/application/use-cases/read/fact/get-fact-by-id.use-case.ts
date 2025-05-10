import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { IFactRepository } from '../../../../domain/interfaces/fact-repository.interface';
import { FactRepositoryToken } from '../../../../tokens/fact-repository.token';
import { GetFactByIdQuery } from '../../../queries/fact/get-fact-by-id.query';

import { FactDto } from '@/shared/presentation/dto/fact.dto';
import { mapToFactDto } from '@/shared/presentation/mappers/fact.mapper';

@Injectable()
export class GetFactByIdUseCase {
    constructor(
        @Inject(FactRepositoryToken)
        private readonly factRepository: IFactRepository,
    ) {}

    async execute(query: GetFactByIdQuery): Promise<FactDto> {
        const fact = await this.factRepository.findById(query.payload.id);

        if (!fact) {
            throw new NotFoundException(
                `No se encontró ningún Fact con ID ${query.payload.id}`,
            );
        }

        return mapToFactDto(fact);
    }
}
