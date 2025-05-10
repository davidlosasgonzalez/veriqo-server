import { AGENT_EVENT_TYPE } from '@/shared/domain/enums/agent-event-type.enum';
import { FactualCheckRequiredEventPayload } from '@/shared/domain/events/agent-events';

/**
 * Tipado de payloads asociados a cada tipo de evento.
 */
export interface AgentEventPayload {
    [AGENT_EVENT_TYPE.FACTUAL_CHECK_REQUIRED]: FactualCheckRequiredEventPayload;
    [AGENT_EVENT_TYPE.FACTUAL_VERIFICATION_RESULT]: unknown;
}
