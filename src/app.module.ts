import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentsModule } from './agents/agents.module';
import { typeOrmConfig } from './config/typeorm/typeorm.config';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

/**
 * Módulo raíz de la aplicación.
 * Carga la configuración global, la base de datos y los módulos principales del sistema.
 */
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRoot(typeOrmConfig),
        AgentsModule,
        CoreModule,
        SharedModule,
    ],
})
export class AppModule {}
