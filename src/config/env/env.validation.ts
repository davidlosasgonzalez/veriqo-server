import { z } from 'zod';
import { LlmEmbeddingProvider } from '@/shared/types/enums/llm-embedding-provider';
import { LlmModel } from '@/shared/types/enums/llm-model.types';
import { LlmProvider } from '@/shared/types/enums/llm-provider.enum';

/**
 * Esquema de validación para las variables de entorno utilizando Zod.
 */
export const envSchema = z.object({
    // Configuración de la base de datos.
    DB_TYPE: z.enum([
        'mysql',
        'postgres',
        'sqlite',
        'mariadb',
        'oracle',
        'mssql',
    ]),
    DB_HOST: z.string().min(1, 'DB_HOST no puede estar vacío'),
    DB_PORT: z.coerce.number().int().min(1).optional(),
    DB_USER: z.string().min(1, 'DB_USER no puede estar vacío'),
    DB_PASSWORD: z.string().min(1, 'DB_PASSWORD no puede estar vacío'),
    DB_NAME: z.string().min(1, 'DB_NAME no puede estar vacío'),

    // Claves de API para servicios externos.
    OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY no puede estar vacío'),
    NEWS_API_KEY: z.string().min(1, 'NEWS_API_KEY no puede estar vacío'),
    CLAUDE_API_KEY: z.string().min(1, 'CLAUDE_API_KEY no puede estar vacío'),
    BRAVE_API_KEY: z.string().min(1, 'BRAVE_API_KEY no puede estar vacío'),
    GOOGLE_CLOUD_API_KEY: z
        .string()
        .min(1, 'GOOGLE_CLOUD_API_KEY no puede estar vacío'),
    GOOGLE_CX_ID: z.string().min(1, 'GOOGLE_CX_ID no puede estar vacío'),

    // Configuración del servidor.
    PORT: z.coerce.number().int().positive().optional(),
    NODE_ENV: z.string().min(1, 'NODE_ENV no puede estar vacío'),

    // Modelos LLM y embeddings.
    LLM_VALIDATOR_PROVIDER: z.nativeEnum(LlmProvider),
    LLM_FACTCHECKER_PROVIDER: z.nativeEnum(LlmProvider),
    LLM_VALIDATOR_MODEL: z.nativeEnum(LlmModel),
    LLM_EMBEDDING_MODEL: z.nativeEnum(LlmModel),
    LLM_FACTCHECKER_MODEL: z.nativeEnum(LlmModel),
    VALIDATOR_MAX_INPUT_CHARS: z.coerce.number().default(3000),
    EMBEDDING_SIMILARITY_THRESHOLD: z.coerce
        .number()
        .min(0.0, 'Debe ser >= 0.0')
        .max(1.0, 'Debe ser <= 1.0')
        .default(0.8),
});

/**
 * Tipo inferido del esquema de validación de las variables de entorno.
 */
export type EnvSchema = z.infer<typeof envSchema>;
