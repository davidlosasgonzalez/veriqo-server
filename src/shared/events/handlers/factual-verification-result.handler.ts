import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { IFactRepository } from '@/shared/domain/interfaces/fact-repository.interface';
import { FactualVerificationResultEvent } from '@/shared/events/factual-verification-result.event';
import { FactRepositoryToken } from '@/shared/tokens/fact-repository.token';

@EventsHandler(FactualVerificationResultEvent)
export class FactualVerificationResultHandler
    implements IEventHandler<FactualVerificationResultEvent>
{
    private readonly logger = new Logger(FactualVerificationResultHandler.name);

    constructor(
        @Inject(FactRepositoryToken)
        private readonly factRepo: IFactRepository,
    ) {}

    async handle(event: FactualVerificationResultEvent): Promise<void> {
        this.logger.log(
            `[FactChecker] Evento recibido: ${JSON.stringify(event.payload)}`,
        );

        const { factId, newCategory, newStatus } = event.payload;

        const fact = await this.factRepo.findById(factId);

        if (!fact) {
            const msg = `Fact con ID ${factId} no encontrado.`;
            this.logger.error(msg);
            throw new Error(msg);
        }

        await this.factRepo.updateStatusAndCategory({
            factId,
            newStatus,
            newCategory,
        });

        this.logger.log(`[FactChecker] Fact con ID ${factId} actualizado.`);
    }
}
