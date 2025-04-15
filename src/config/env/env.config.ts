import { config } from 'dotenv';
import { envSchema } from './env.validation';

config();

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error('Error validando variables de entorno:');
    console.error(parsedEnv.error.format());
    process.exit(1);
}

export type SupportedDbType =
    | 'mysql'
    | 'postgres'
    | 'sqlite'
    | 'mariadb'
    | 'oracle'
    | 'mssql';

export const env: {
    DB_TYPE: SupportedDbType;
    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    OPENAI_API_KEY: string;
    NEWS_API_KEY: string;
    CLAUDE_API_KEY: string;
    BRAVE_API_KEY: string;
    GOOGLE_CLOUD_API_KEY: string;
    GOOGLE_CX_ID: string;
    PORT: number;
} = {
    DB_TYPE: parsedEnv.data.DB_TYPE,
    DB_HOST: parsedEnv.data.DB_HOST,
    DB_PORT: parsedEnv.data.DB_PORT ?? 3306,
    DB_USER: parsedEnv.data.DB_USER,
    DB_PASSWORD: parsedEnv.data.DB_PASSWORD,
    DB_NAME: parsedEnv.data.DB_NAME,
    OPENAI_API_KEY: parsedEnv.data.OPENAI_API_KEY,
    NEWS_API_KEY: parsedEnv.data.NEWS_API_KEY,
    CLAUDE_API_KEY: parsedEnv.data.CLAUDE_API_KEY,
    BRAVE_API_KEY: parsedEnv.data.BRAVE_API_KEY,
    GOOGLE_CLOUD_API_KEY: parsedEnv.data.GOOGLE_CLOUD_API_KEY,
    GOOGLE_CX_ID: parsedEnv.data.GOOGLE_CX_ID,
    PORT: parsedEnv.data.PORT ?? 3001,
};
