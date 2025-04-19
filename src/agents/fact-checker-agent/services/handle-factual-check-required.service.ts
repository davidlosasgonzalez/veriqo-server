import { Injectable } from '@nestjs/common';
import { VerifyClaimService } from '../services/verify-claim.service';
import { FactualCheckRequiredEventPayload } from '@/shared/events/payloads/factual-check-required-event.payload';
import { AgentEventPayload } from '@/shared/events/types/agent-event-payload.type';

/**
 * Servicio principal del agente FactChecker. Se encarga de buscar información,
 * consultar al modelo LLM y emitir la verificación factual.
 */
@Injectable()
export class HandleFactualCheckRequiredService {
    constructor(private readonly verifyClaimService: VerifyClaimService) {}

    /**
     * Maneja la recepción de un evento factual_check_required.
     */
    async execute(
        payload: AgentEventPayload<FactualCheckRequiredEventPayload>,
    ): Promise<void> {
        const { claim, findingId } = payload.data;

        await this.verifyClaimService.execute({
            claim,
            findingId,
        });
    }
}
