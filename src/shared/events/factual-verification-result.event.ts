import { IEvent } from '@nestjs/cqrs';

import { FactualVerificationResultPayload } from '@/shared/domain/events/agent-events';

/**
 * Evento que se emite cuando se completa una verificación factual externa.
 */
export class FactualVerificationResultEvent implements IEvent {
    constructor(public readonly payload: FactualVerificationResultPayload) {}
}
