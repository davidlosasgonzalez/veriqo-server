import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '@/config/typeorm/typeorm.config';
import { AgentLoggerService } from '@/shared/logger/agent-logger.service';

@Module({
    imports: [TypeOrmModule.forRoot(typeOrmConfig), AgentLoggerService],
    exports: [TypeOrmModule],
})
export class DatabaseModule {}
