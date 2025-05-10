import { Inject, Injectable } from '@nestjs/common';

import { CreateFactCommand } from '../../../commands/fact/create-fact.command';

import { Fact } from '@/shared/domain/entities/fact';
import { IFactRepository } from '@/shared/domain/interfaces/fact-repository.interface';
import { FactRepositoryToken } from '@/shared/tokens/fact-repository.token';

@Injectable()
export class CreateFactUseCase {
    constructor(
        @Inject(FactRepositoryToken)
        private readonly factRepository: IFactRepository,
    ) {}

    async execute(command: CreateFactCommand): Promise<Fact> {
        const now = new Date();
        const fact = new Fact(
            crypto.randomUUID(),
            command.payload.status,
            command.payload.category,
            now,
            now,
        );

        return this.factRepository.save(fact);
    }
}
