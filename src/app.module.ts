import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentsModule } from './agents/agents.module';
import { typeOrmConfig } from './config/typeorm/typeorm.config';
import { DatabaseModule } from './database/database.model';
import { SharedModule } from './shared/shared.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRoot(typeOrmConfig),
        AgentsModule,
        DatabaseModule,
        SharedModule,
    ],
})
export class AppModule {}
