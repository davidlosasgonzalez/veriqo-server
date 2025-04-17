import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FactCheckerAgentService } from './fact-checker-agent.service';
import { FactualCheckRequiredEventPayload } from '@/shared/events/payloads/factual-check-required-event.payload';
import { AgentEventPayload } from '@/shared/events/types/agent-event-payload.type';
import { AgentEventType } from '@/shared/events/types/agent-event-type.enum';

/**
 * Listener que suscribe el agente de verificación factual a eventos de tipo FACTUAL_CHECK_REQUIRED.
 */
@Injectable()
export class FactCheckerAgentListener implements OnModuleInit {
    constructor(
        private readonly eventEmitter: EventEmitter2,
        private readonly factCheckerAgentService: FactCheckerAgentService,
    ) {}

    /**
     * Se ejecuta al iniciar el módulo.
     * Registra el agente para reaccionar ante eventos FACTUAL_CHECK_REQUIRED.
     */
    onModuleInit(): void {
        this.eventEmitter.on(
            AgentEventType.FACTUAL_CHECK_REQUIRED,
            async (
                payload: AgentEventPayload<FactualCheckRequiredEventPayload>,
            ) => {
                await this.factCheckerAgentService.handleFactualCheckRequired(
                    payload,
                );
            },
        );
    }
}
