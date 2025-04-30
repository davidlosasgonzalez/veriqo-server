import { AgentEventType } from '../enums/agent-event-type.enum';
import { FactualCheckRequiredEventPayload } from '../payloads/factual-check-required-event.payload';

/**
 * Tipado de payloads asociados a cada tipo de evento.
 */
export interface AgentEventPayload {
    [AgentEventType.FACTUAL_CHECK_REQUIRED]: FactualCheckRequiredEventPayload;
    [AgentEventType.FACTUAL_VERIFICATION_RESULT]: unknown;
}
