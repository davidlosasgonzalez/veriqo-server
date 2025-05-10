import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { VerifyFactUseCase } from '../../use-cases/write/fact/verify-fact.use-case';

import { VerifyFactCommand } from './verify-fact.command';

import { Verification } from '@/shared/domain/entities/verification';

@CommandHandler(VerifyFactCommand)
export class VerifyFactHandler
    implements ICommandHandler<VerifyFactCommand, Verification>
{
    constructor(private readonly useCase: VerifyFactUseCase) {}

    execute(command: VerifyFactCommand): Promise<Verification> {
        return this.useCase.execute(command);
    }
}
