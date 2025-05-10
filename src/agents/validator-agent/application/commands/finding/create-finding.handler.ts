import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateFindingUseCase } from '../../use-cases/write/finding/create-finding.use-case';

import { CreateFindingCommand } from './create-finding.command';

import { Finding } from '@/agents/validator-agent/domain/entities/finding';

@CommandHandler(CreateFindingCommand)
export class CreateFindingHandler
    implements ICommandHandler<CreateFindingCommand, Finding>
{
    constructor(private readonly useCase: CreateFindingUseCase) {}

    execute(command: CreateFindingCommand): Promise<Finding> {
        return this.useCase.execute(command);
    }
}
