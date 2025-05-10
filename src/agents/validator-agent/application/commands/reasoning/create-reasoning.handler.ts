import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateReasoningUseCase } from '../../use-cases/write/reasoning/create-reasoning.use-case';

import { CreateReasoningCommand } from './create-reasoning.command';

import { Reasoning } from '@/shared/domain/entities/reasoning';

@CommandHandler(CreateReasoningCommand)
export class CreateReasoningHandler
    implements ICommandHandler<CreateReasoningCommand, Reasoning>
{
    constructor(private readonly useCase: CreateReasoningUseCase) {}

    execute(command: CreateReasoningCommand): Promise<Reasoning> {
        return this.useCase.execute(command);
    }
}
