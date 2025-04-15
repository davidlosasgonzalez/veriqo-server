import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentsModule } from './agents/agents.module'; // Importamos AgentsModule, que ya incluye todos los agentes
import { typeOrmConfig } from './config/typeorm/typeorm.config';

// Módulos de los agentes

// Módulo de base de datos
import { DatabaseModule } from './database/database.model';
import { SharedModule } from './shared/shared.module';

@Module({
    imports: [
        // Configuración global de variables de entorno
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),

        // Configuración de la base de datos
        TypeOrmModule.forRoot(typeOrmConfig),

        // Módulos de los agentes (importados dentro de AgentsModule)
        AgentsModule, // Ahora importamos solo el módulo de agentes

        // Módulo de base de datos
        DatabaseModule,

        // SharedModule, donde se guardan los servicios comunes
        SharedModule,
    ],
})
export class AppModule {}
