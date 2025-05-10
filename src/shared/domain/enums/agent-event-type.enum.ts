/**
 * Enum de tipos de eventos que pueden ser emitidos entre agentes.
 */
export const AGENT_EVENT_TYPE = {
    FACTUAL_CHECK_REQUIRED: 'factual_check_required',
    FACTUAL_VERIFICATION_RESULT: 'factual_verification_result',
} as const;

export type AgentEventType =
    (typeof AGENT_EVENT_TYPE)[keyof typeof AGENT_EVENT_TYPE];
