import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FactCheckerAgentModule } from './agents/fact-checker/fact-checker-agent.module';
import { ValidatorAgentModule } from './agents/validator-agent/validator-agent.module';
import { typeOrmConfig } from './config/typeorm/typeorm.config';
import { DatabaseSeederModule } from './shared/infrastructure/database/modules/database-seeder.module';
import { CoreModule } from './shared/presentation/core.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRoot(typeOrmConfig),
        CoreModule,
        ValidatorAgentModule,
        FactCheckerAgentModule,
        DatabaseSeederModule,
    ],
})
export class AppModule {}
