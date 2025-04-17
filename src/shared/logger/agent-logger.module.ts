import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentLoggerService } from './agent-logger.service';
import { AgentLog } from '@/core/database/entities/agent-log.entity';

@Module({
    imports: [TypeOrmModule.forFeature([AgentLog])],
    providers: [AgentLoggerService],
    exports: [AgentLoggerService],
})
export class AgentLoggerModule {}
