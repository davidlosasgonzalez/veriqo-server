import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { FactualCheckRequiredEvent } from '../factual-check-required-event.payload';

import { VerifyFactCommand } from '@/agents/fact-checker/application/commands/verify/verify-fact.command';
import { VerifyFactUseCase } from '@/agents/fact-checker/application/use-cases/write/fact/verify-fact.use-case';

@EventsHandler(FactualCheckRequiredEvent)
export class FactualCheckRequiredHandler
    implements IEventHandler<FactualCheckRequiredEvent>
{
    private readonly logger = new Logger(FactualCheckRequiredHandler.name);

    constructor(private readonly verifyFactUseCase: VerifyFactUseCase) {}

    async handle(event: FactualCheckRequiredEvent): Promise<void> {
        this.logger.log(
            '[FactChecker] FACTUAL_CHECK_REQUIRED recibido:',
            event.payload,
        );

        const { factId, findingId, claim, searchQuery, siteSuggestions } =
            event.payload;

        try {
            await this.verifyFactUseCase.execute(
                new VerifyFactCommand({
                    claim,
                    context: {
                        factId,
                        searchQuery,
                        siteSuggestions: siteSuggestions ?? [],
                    },
                }),
            );
            this.logger.log(
                `[FactChecker] Verificación de hecho completada para el factId: ${factId}`,
            );
        } catch (error) {
            this.logger.error(
                `Error al procesar el evento FactualCheckRequired para factId ${factId}`,
                error instanceof Error ? error.stack : String(error),
            );
            throw error;
        }
    }
}
