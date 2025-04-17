import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentEventPayload } from './types/agent-event-payload.type';
import { AgentEvent } from '@/core/database/entities/agent-event.entity';

@Injectable()
export class EventBusService {
    constructor(
        private readonly eventEmitter: EventEmitter2,
        @InjectRepository(AgentEvent)
        private readonly eventRepo: Repository<AgentEvent>,
    ) {}

    /**
     * Emite un evento a otros agentes y lo guarda en base de datos.
     * @param payload Datos del evento a emitir
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
        this.eventEmitter.emit(payload.type, payload);
    }

    /**
     * Devuelve todos los eventos registrados por los agentes.
     */
    async findAllEvents(): Promise<AgentEvent[]> {
        return this.eventRepo.find({ order: { createdAt: 'DESC' } });
    }

    /**
     * Marca como procesado un evento específico asociado a un hallazgo (finding).
     * @param findingId ID del hallazgo relacionado
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
