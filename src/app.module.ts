import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm/typeorm.config';

import { DatabaseSeederModule } from './infrastructure/database/database-seeder.module';
import { ValidatorAgentModule } from '@/agents/validator/validator-agent.module';

/**
 * Módulo raíz de la aplicación.
 */
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRoot(typeOrmConfig),
        ValidatorAgentModule,
        DatabaseSeederModule,
    ],
})
export class AppModule {}
