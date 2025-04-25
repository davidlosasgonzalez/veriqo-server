/**
 * Roles permitidos por OpenAI.
 */
export type OpenAiRole = 'system' | 'user' | 'assistant';

/**
 * Roles permitidos por Claude (Anthropic).
 */
export type ClaudeRole = 'user' | 'assistant';

/**
 * Mensaje genérico para uso con LLMs.
 */
export type LlmMessage = {
    role: OpenAiRole;
    content: string;
};

/**
 * Mensaje válido para Claude.
 */
export type ClaudeMessage = {
    role: ClaudeRole;
    content: string;
};
