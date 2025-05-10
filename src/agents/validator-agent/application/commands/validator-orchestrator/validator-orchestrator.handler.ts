import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { VerifyClaimOrchestratorService } from '../../services/verify-claim-orchestrator.service';

import { ValidatorOrchestratorCommand } from './validator-orchestrator.command';

import { Finding } from '@/agents/validator-agent/domain/entities/finding';

@CommandHandler(ValidatorOrchestratorCommand)
export class ValidatorOrchestratorHandler
    implements ICommandHandler<ValidatorOrchestratorCommand, Finding[]>
{
    constructor(
        private readonly orchestrator: VerifyClaimOrchestratorService,
    ) {}

    execute(command: ValidatorOrchestratorCommand): Promise<Finding[]> {
        return this.orchestrator.execute(command);
    }
}
