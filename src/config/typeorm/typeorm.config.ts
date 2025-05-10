import { join } from 'path';

import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { env } from '../env/env.config';

/**
 * Configuración de TypeORM para la conexión a la base de datos.
 */
export const typeOrmConfig: TypeOrmModuleOptions = {
    type: env.DB_TYPE,
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    entities: [join(__dirname, '../../**/*.orm-entity.{ts,js}')],

    // TODO: solo para desarrollo local. Usa migraciones en producción.
    synchronize: true,
    dropSchema: false,
};
