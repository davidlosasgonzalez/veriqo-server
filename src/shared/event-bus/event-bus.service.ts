import { Injectable } from '@nestjs/common';
import { EventBus, IEvent } from '@nestjs/cqrs';

@Injectable()
export class EventBusService {
    constructor(private readonly eventBus: EventBus) {}

    publish(event: IEvent): void {
        this.eventBus.publish(event);
    }
}
