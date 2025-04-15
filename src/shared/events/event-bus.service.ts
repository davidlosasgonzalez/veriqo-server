import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AgentEventPayload } from './types/agent-event-payload.type';

@Injectable()
export class EventBusService {
    constructor(private readonly eventEmitter: EventEmitter2) {}

    async emit<T = any>(payload: AgentEventPayload<T>): Promise<void> {
        this.eventEmitter.emit(payload.type, payload);
    }
}
