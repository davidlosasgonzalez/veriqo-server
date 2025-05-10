/**
 * Enum de proveedores de LLM que pueden ser utilizados en el sistema.
 */
export const LLM_PROVIDER = {
    OPENAI: 'openai',
    ANTHROPIC: 'anthropic',
} as const;

export type LlmProvider = (typeof LLM_PROVIDER)[keyof typeof LLM_PROVIDER];
