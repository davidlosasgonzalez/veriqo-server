import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HandleFactualCheckRequiredService } from './services';
import { FactualCheckRequiredEventPayload } from '@/shared/events/payloads/factual-check-required-event.payload';
import { AgentEventPayload } from '@/shared/events/types/agent-event-payload.type';
import { AgentEventType } from '@/shared/events/types/agent-event-type.enum';

/**
 * Listener que conecta el FactCheckerAgent al sistema de eventos.
 * Se suscribe al evento `FACTUAL_CHECK_REQUIRED` y delega su resolución
 * al servicio de caso de uso correspondiente.
 */
@Injectable()
export class FactCheckerAgentListener implements OnModuleInit {
    constructor(
        private readonly eventEmitter: EventEmitter2,
        private readonly handleFactualCheckRequiredService: HandleFactualCheckRequiredService,
    ) {}

    /**
     * Método que se ejecuta al inicializar el módulo.
     * Registra un listener para el evento FACTUAL_CHECK_REQUIRED y
     * llama al servicio `HandleFactualCheckRequiredService` cuando se emite.
     */
    onModuleInit(): void {
        this.eventEmitter.on(
            AgentEventType.FACTUAL_CHECK_REQUIRED,
            async (
                payload: AgentEventPayload<FactualCheckRequiredEventPayload>,
            ): Promise<void> => {
                await this.handleFactualCheckRequiredService.execute(payload);
            },
        );
    }
}
