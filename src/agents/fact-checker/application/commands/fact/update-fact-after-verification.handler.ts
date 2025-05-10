import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UpdateFactAfterVerificationUseCase } from '../../use-cases/write/fact/update-fact-after-verification.use-case';

import { UpdateFactAfterVerificationCommand } from './update-fact-after-verification.command';

@CommandHandler(UpdateFactAfterVerificationCommand)
export class UpdateFactAfterVerificationHandler
    implements ICommandHandler<UpdateFactAfterVerificationCommand, void>
{
    constructor(private readonly useCase: UpdateFactAfterVerificationUseCase) {}

    execute(command: UpdateFactAfterVerificationCommand): Promise<void> {
        return this.useCase.execute(command);
    }
}
