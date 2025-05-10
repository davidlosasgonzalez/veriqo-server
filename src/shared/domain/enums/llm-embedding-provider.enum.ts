/**
 * Enum específico para proveedores de embeddings en el sistema.
 * Actualmente solo se permite OpenAI como proveedor de embeddings.
 */
export const LLM_EMBEDDING_PROVIDER = {
    OPENAI: 'openai',
} as const;

export type LlmEmbeddingProvider =
    (typeof LLM_EMBEDDING_PROVIDER)[keyof typeof LLM_EMBEDDING_PROVIDER];
