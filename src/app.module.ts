import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FactCheckerAgentModule } from './agents/fact-checker/fact-checker-agent.module';
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
        FactCheckerAgentModule,
        DatabaseSeederModule,
    ],
})
export class AppModule {}
