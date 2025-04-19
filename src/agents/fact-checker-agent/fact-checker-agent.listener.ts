import { Injectable, OnModuleInit } from '@nestjs/common';
import { VerifyClaimService } from './services/verify-claim.service';
import { EventBusService } from '@/shared/events/event-bus.service';
import { FactualCheckRequiredEventPayload } from '@/shared/events/payloads/factual-check-required-event.payload';
import { AgentEventType } from '@/shared/events/types/agent-event-type.enum';

/**
 * Listener encargado de reaccionar a eventos FACTUAL_CHECK_REQUIRED
 * emitidos por el ValidatorAgent. Este componente es el punto de entrada
 * para que el FactCheckerAgent inicie el proceso de verificación factual.
 *
 * Al recibir un evento, delega en el servicio VerifyClaimService para realizar
 * el análisis, generar reasoning, obtener fuentes y emitir el resultado.
 */
@Injectable()
export class FactCheckerAgentListener implements OnModuleInit {
    constructor(
        private readonly eventBus: EventBusService,
        private readonly verifyClaimService: VerifyClaimService,
    ) {}

    /**
     * Se ejecuta automáticamente al iniciar el módulo.
     * Registra un listener en el EventBus para el tipo FACTUAL_CHECK_REQUIRED.
     */
    onModuleInit(): void {
        this.eventBus.on<FactualCheckRequiredEventPayload>(
            AgentEventType.FACTUAL_CHECK_REQUIRED,
            async (payload) => {
                await this.verifyClaimService.execute({
                    claim: payload.claim,
                    findingId: payload.findingId,
                });
            },
        );
    }
}
