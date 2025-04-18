import { z } from 'zod';

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

    // Modelos LLM y embeddings.
    VALIDATOR_MODEL: z.string().min(1, 'VALIDATOR_MODEL no puede estar vacío'),
    FACTCHECKER_MODEL: z
        .string()
        .min(1, 'FACTCHECKER_MODEL no puede estar vacío'),
    EMBEDDING_MODEL: z.string().min(1, 'EMBEDDING_MODEL no puede estar vacío'),
    EMBEDDING_MODEL_PROVIDER: z
        .string()
        .min(1, 'EMBEDDING_MODEL_PROVIDER no puede estar vacío'),
    EMBEDDING_SIMILARITY_THRESHOLD: z.coerce
        .number()
        .min(0.0, 'Debe ser >= 0.0')
        .max(1.0, 'Debe ser <= 1.0')
        .default(0.8),

    // Parámetros adicionales.
    FACT_CHECK_CACHE_DAYS: z.coerce.number().int().min(1).default(7),
});

export type EnvSchema = z.infer<typeof envSchema>;
