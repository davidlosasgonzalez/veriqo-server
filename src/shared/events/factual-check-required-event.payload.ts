import { IEvent } from '@nestjs/cqrs';

import { FactualCheckRequiredEventPayload } from '@/shared/domain/events/agent-events';

export class FactualCheckRequiredEvent implements IEvent {
    constructor(public readonly payload: FactualCheckRequiredEventPayload) {}
}
