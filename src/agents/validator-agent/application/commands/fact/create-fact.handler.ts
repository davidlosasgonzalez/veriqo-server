import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateFactUseCase } from '../../use-cases/write/fact/create-fact.use-case';

import { CreateFactCommand } from './create-fact.command';

import { Fact } from '@/shared/domain/entities/fact';

@CommandHandler(CreateFactCommand)
export class CreateFactHandler
    implements ICommandHandler<CreateFactCommand, Fact>
{
    constructor(private readonly useCase: CreateFactUseCase) {}

    async execute(command: CreateFactCommand): Promise<Fact> {
        return this.useCase.execute(command);
    }
}
