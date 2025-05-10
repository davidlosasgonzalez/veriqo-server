import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateFindingSearchContextUseCase } from '../../use-cases/write/finding/create-finding-search-context.use-case';

import { CreateFindingSearchContextCommand } from './create-finding-search-context.command';

import { FindingSearchContext } from '@/agents/validator-agent/domain/entities/finding-search-context';

@CommandHandler(CreateFindingSearchContextCommand)
export class CreateFindingSearchContextHandler
    implements
        ICommandHandler<CreateFindingSearchContextCommand, FindingSearchContext>
{
    constructor(private readonly useCase: CreateFindingSearchContextUseCase) {}

    execute(
        command: CreateFindingSearchContextCommand,
    ): Promise<FindingSearchContext> {
        return this.useCase.execute(command);
    }
}
