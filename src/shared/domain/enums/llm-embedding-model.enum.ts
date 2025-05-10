/**
 * Enum específico para modelos de embeddings en el sistema.
 */
export const LLM_EMBEDDING_MODEL = {
    TEXT_EMBEDDING_3_SMALL: 'text-embedding-3-small',
} as const;

export type LlmEmbeddingProvider =
    (typeof LLM_EMBEDDING_MODEL)[keyof typeof LLM_EMBEDDING_MODEL];
