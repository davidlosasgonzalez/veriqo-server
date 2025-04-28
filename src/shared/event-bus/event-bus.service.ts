import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from 'eventemitter2';
import { AgentEventType } from '@/shared/types/enums/agent-event-type.enum';
import { AgentEventPayload } from '@/shared/types/parsed-types/agent-event-payload.type';

/**
 * Servicio centralizado para emitir y escuchar eventos entre agentes.
 * Este servicio utiliza el patrón EventEmitter para la comunicación asincrónica entre los agentes.
 */
@Injectable()
export class EventBusService {
    private readonly eventEmitter = new EventEmitter2();

    /**
     * Emite un evento hacia todos los agentes suscritos.
     *
     * @param eventType - Tipo de evento emitido (debe ser uno de los tipos definidos en `AgentEventType`).
     * @param payload - Payload asociado al evento, que debe cumplir con la estructura definida en `AgentEventPayload`.
     */
    emit<T extends AgentEventType>(
        eventType: T,
        payload: AgentEventPayload[T],
    ): void {
        this.eventEmitter.emit(eventType, payload);
    }

    /**
     * Se suscribe a un tipo de evento concreto.
     *
     * @param eventType - Tipo de evento a escuchar.
     * @param listener - Función callback que se ejecutará al recibir el evento.
     */
    on<T extends AgentEventType>(
        eventType: T,
        listener: (payload: AgentEventPayload[T]) => void,
    ): void {
        this.eventEmitter.on(eventType, listener);
    }
}
