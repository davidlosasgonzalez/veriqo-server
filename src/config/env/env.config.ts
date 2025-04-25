import { config } from 'dotenv';
import { envSchema } from './env.validation';

config();

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error('Error validando variables de entorno:');
    console.error(parsedEnv.error.format());
    process.exit(1);
}

/**
 * Tipos de bases de datos soportadas.
 */
export type SupportedDbType =
    | 'mysql'
    | 'postgres'
    | 'mariadb'
    | 'sqlite'
    | 'better-sqlite3';

/**
 * Objeto que contiene las variables de entorno validadas y con valores por defecto.
 */
export const env: {
    // Configuración de la base de datos.
    DB_TYPE: SupportedDbType;
    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;

    // Claves de API para servicios externos.
    OPENAI_API_KEY: string;
    NEWS_API_KEY: string;
    CLAUDE_API_KEY: string;
    BRAVE_API_KEY: string;
    GOOGLE_CLOUD_API_KEY: string;
    GOOGLE_CX_ID: string;

    // Configuración del servidor.
    PORT: number;
    NODE_ENV: string;

    // Modelos LLM y embeddings.
    LLM_PROVIDER: string;
    VALIDATOR_MODEL: string;
    VALIDATOR_MAX_INPUT_CHARS: number;
    FACTCHECKER_MODEL: string;
    FACT_CHECK_CACHE_DAYS: number;
    EMBEDDING_MODEL: string;
    EMBEDDING_MODEL_PROVIDER: string;
    EMBEDDING_SIMILARITY_THRESHOLD: number;
} = {
    // Configuración de la base de datos.
    DB_TYPE: parsedEnv.data.DB_TYPE as SupportedDbType,
    DB_HOST: parsedEnv.data.DB_HOST,
    DB_PORT: parsedEnv.data.DB_PORT ?? 3306,
    DB_USER: parsedEnv.data.DB_USER,
    DB_PASSWORD: parsedEnv.data.DB_PASSWORD,
    DB_NAME: parsedEnv.data.DB_NAME,

    // Claves de API para servicios externos.
    OPENAI_API_KEY: parsedEnv.data.OPENAI_API_KEY,
    NEWS_API_KEY: parsedEnv.data.NEWS_API_KEY,
    CLAUDE_API_KEY: parsedEnv.data.CLAUDE_API_KEY,
    BRAVE_API_KEY: parsedEnv.data.BRAVE_API_KEY,
    GOOGLE_CLOUD_API_KEY: parsedEnv.data.GOOGLE_CLOUD_API_KEY,
    GOOGLE_CX_ID: parsedEnv.data.GOOGLE_CX_ID,

    // Configuración del servidor.
    PORT: parsedEnv.data.PORT ?? 3001,
    NODE_ENV: parsedEnv.data.NODE_ENV ?? 'development',

    // Modelos LLM y embeddings.
    LLM_PROVIDER: parsedEnv.data.LLM_PROVIDER,
    VALIDATOR_MODEL: parsedEnv.data.VALIDATOR_MODEL,
    VALIDATOR_MAX_INPUT_CHARS: parsedEnv.data.VALIDATOR_MAX_INPUT_CHARS,
    FACTCHECKER_MODEL: parsedEnv.data.FACTCHECKER_MODEL,
    FACT_CHECK_CACHE_DAYS: parsedEnv.data.FACT_CHECK_CACHE_DAYS ?? 7,
    EMBEDDING_MODEL: parsedEnv.data.EMBEDDING_MODEL,
    EMBEDDING_MODEL_PROVIDER: parsedEnv.data.EMBEDDING_MODEL_PROVIDER,
    EMBEDDING_SIMILARITY_THRESHOLD:
        parsedEnv.data.EMBEDDING_SIMILARITY_THRESHOLD ?? 0.8,
};
