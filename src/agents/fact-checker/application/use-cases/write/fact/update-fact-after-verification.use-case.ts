import { Inject, Injectable } from '@nestjs/common';

import { UpdateFactAfterVerificationCommand } from '../../../commands/fact/update-fact-after-verification.command';

import { IFactRepository } from '@/shared/domain/interfaces/fact-repository.interface';
import { FactRepositoryToken } from '@/shared/tokens/fact-repository.token';

@Injectable()
export class UpdateFactAfterVerificationUseCase {
    constructor(
        @Inject(FactRepositoryToken)
        private readonly factRepository: IFactRepository,
    ) {}

    async execute(command: UpdateFactAfterVerificationCommand): Promise<void> {
        await this.factRepository.updateStatusAndCategory({
            factId: command.payload.factId,
            newStatus: command.payload.newStatus,
            newCategory: command.payload.newCategory,
        });
    }
}
