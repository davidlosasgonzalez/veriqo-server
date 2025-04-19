import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentEventPayload } from './types/agent-event-payload.type';
import { AgentEventType } from './types/agent-event-type.enum';
import { AgentEvent } from '@/core/database/entities/agent-event.entity';

/**
 * Servicio centralizado para la emisión, persistencia y suscripción a eventos entre agentes.
 * Permite registrar listeners personalizados por tipo de evento.
 */
@Injectable()
export class EventBusService {
    constructor(
        private readonly eventEmitter: EventEmitter2,
        @InjectRepository(AgentEvent)
        private readonly eventRepo: Repository<AgentEvent>,
    ) {}

    /**
     * Mapa interno de listeners registrados por tipo de evento.
     */
    private readonly subscribers = new Map<
        AgentEventType,
        ((payload: any) => void | Promise<void>)[]
    >();

    /**
     * Registra un listener para un tipo de evento específico.
     * @param type Tipo de evento que se quiere escuchar.
     * @param handler Función que se ejecutará cuando el evento sea emitido.
     */
    on<T>(
        type: AgentEventType,
        handler: (payload: T) => void | Promise<void>,
    ): void {
        if (!this.subscribers.has(type)) {
            this.subscribers.set(type, []);
        }
        this.subscribers.get(type)!.push(handler);
    }

    /**
     * Emite un evento a otros agentes y lo guarda en base de datos.
     * También dispara los listeners registrados manualmente mediante `.on(...)`.
     *
     * @param payload Datos del evento a emitir.
     */
    async emitEvent<T extends Record<string, any>>(
        payload: AgentEventPayload<T>,
    ): Promise<void> {
        const eventEntity = this.eventRepo.create({
            emitterAgent: payload.sourceAgent,
            type: payload.type,
            payload: payload.data,
        });

        await this.eventRepo.save(eventEntity);

        // Disparar listeners registrados manualmente
        const handlers = this.subscribers.get(payload.type as AgentEventType);

        if (handlers) {
            for (const handler of handlers) {
                try {
                    await handler(payload.data);
                } catch (err) {
                    console.error(
                        `[EventBusService] Error en handler de ${payload.type}: ${err.message}`,
                    );
                }
            }
        }
    }

    /**
     * Devuelve todos los eventos registrados por los agentes.
     */
    async findAllEvents(): Promise<AgentEvent[]> {
        return this.eventRepo.find({ order: { createdAt: 'DESC' } });
    }

    /**
     * Marca como procesado un evento específico asociado a un hallazgo (finding).
     * @param findingId ID del hallazgo relacionado.
     */
    async markAsProcessedByFindingId(findingId: string): Promise<void> {
        if (!findingId) return;

        await this.eventRepo
            .createQueryBuilder()
            .update()
            .set({ status: 'processed' })
            .where('type = :type', { type: 'factual_check_required' })
            .andWhere("JSON_EXTRACT(payload, '$.findingId') = :findingId", {
                findingId,
            })
            .execute();
    }
}
