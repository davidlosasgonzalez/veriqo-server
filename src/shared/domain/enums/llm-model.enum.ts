/**
 * Enum que lista los modelos LLM soportados en Veriqo.
 */
export const LLM_MODEL = {
    GPT_4O: 'gpt-4o',
    CLAUDE_3_5_SONNET: 'claude-3-5-sonnet-20241022',
} as const;

export type LlmModel = (typeof LLM_MODEL)[keyof typeof LLM_MODEL];
