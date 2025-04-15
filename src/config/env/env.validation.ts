import { z } from 'zod';

export const envSchema = z.object({
    DB_TYPE: z.enum([
        'mysql',
        'postgres',
        'sqlite',
        'mariadb',
        'oracle',
        'mssql',
    ]),
    DB_HOST: z.string().min(1, 'DB_HOST no puede estar vacío'),
    DB_PORT: z
        .string()
        .regex(/^\d+$/, 'DB_PORT debe ser un número')
        .transform(Number)
        .optional(),
    DB_USER: z.string().min(1, 'DB_USER no puede estar vacío'),
    DB_PASSWORD: z.string().min(1, 'DB_PASSWORD no puede estar vacío'),
    DB_NAME: z.string().min(1, 'DB_NAME no puede estar vacío'),
    OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY no puede estar vacío'),
    NEWS_API_KEY: z.string().min(1, 'NEWS_API_KEY no puede estar vacío'),
    CLAUDE_API_KEY: z.string().min(1, 'NEWS_API_KEY no puede estar vacío'),
    BRAVE_API_KEY: z.string().min(1, 'BRAVE_API_KEY no puede estar vacío'),
    GOOGLE_CLOUD_API_KEY: z
        .string()
        .min(1, 'GOOLE_CLOUD_API_KEY no puede estar vacío'),
    GOOGLE_CX_ID: z.string().min(1, 'GOOGLE_CX_ID no puede estar vacío'),
    PORT: z
        .string()
        .regex(/^\d+$/, 'PORT debe ser un número')
        .transform(Number)
        .optional(),
});
