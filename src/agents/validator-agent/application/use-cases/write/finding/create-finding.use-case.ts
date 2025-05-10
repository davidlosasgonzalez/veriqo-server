import { Inject, Injectable } from '@nestjs/common';

import { CreateFindingCommand } from '../../../commands/finding/create-finding.command';

import { Finding } from '@/agents/validator-agent/domain/entities/finding';
import { ClaimText } from '@/agents/validator-agent/domain/value-objects/claim-text.vo';
import { IFindingRepository } from '@/shared/domain/interfaces/finding-repository.interface';
import { FindingRepositoryToken } from '@/shared/tokens/finding-repository.token';

@Injectable()
export class CreateFindingUseCase {
    constructor(
        @Inject(FindingRepositoryToken)
        private readonly findingRepository: IFindingRepository,
    ) {}

    async execute(command: CreateFindingCommand): Promise<Finding> {
        const now = new Date();
        const finding = new Finding(
            crypto.randomUUID(),
            new ClaimText(command.payload.claim),
            command.payload.embedding,
            now,
            now,
            command.payload.fact,
            command.payload.needsFactCheckReason ?? null,
        );

        return this.findingRepository.save(finding);
    }
}
