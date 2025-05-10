/**
 * Roles que puede asumir un mensaje dentro de un prompt enviado a un agente.
 */
export const AGENT_PROMPT_ROLE = {
    SYSTEM: 'system',
    USER: 'user',
} as const;

export type AgentPromptRole =
    (typeof AGENT_PROMPT_ROLE)[keyof typeof AGENT_PROMPT_ROLE];
