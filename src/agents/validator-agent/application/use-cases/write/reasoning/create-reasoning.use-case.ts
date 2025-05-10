import { Inject, Injectable } from '@nestjs/common';

import { CreateReasoningCommand } from '../../../commands/reasoning/create-reasoning.command';

import { Reasoning } from '@/shared/domain/entities/reasoning';
import { IReasoningRepository } from '@/shared/domain/interfaces/reasoning-repository.interface';
import { FactReasoning } from '@/shared/domain/value-objects/fact-reasoning.vo';
import { ReasoningSummary } from '@/shared/domain/value-objects/reasoning-summary.vo';
import { ReasoningRepositoryToken } from '@/shared/tokens/reasoning-repository.token';

@Injectable()
export class CreateReasoningUseCase {
    constructor(
        @Inject(ReasoningRepositoryToken)
        private readonly reasoningRepository: IReasoningRepository,
    ) {}

    async execute(command: CreateReasoningCommand): Promise<Reasoning> {
        const now = new Date();
        const reasoning = new Reasoning(
            crypto.randomUUID(),
            new ReasoningSummary(command.payload.summary),
            new FactReasoning(command.payload.content),
            now,
            now,
            command.payload.verificationId ?? null,
            command.payload.factId ?? null,
        );

        return this.reasoningRepository.save(reasoning);
    }
}
