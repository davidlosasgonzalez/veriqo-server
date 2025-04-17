import { Module } from '@nestjs/common';
import { CoreController } from './core.controller';
import { DatabaseService } from './database';
import { EventBusService } from '@/shared/events/event-bus.service';
import { AgentFindingService } from '@/shared/facts/services/agent-finding.service';
import { AgentVerificationService } from '@/shared/facts/services/agent-verification.service';
import { AgentLoggerService } from '@/shared/logger/agent-logger.service';
import { AgentPromptService } from '@/shared/prompts/agent-prompt.service';
import { SharedModule } from '@/shared/shared.module';

@Module({
    imports: [SharedModule],
    controllers: [CoreController],
    providers: [
        DatabaseService,
        AgentLoggerService,
        AgentPromptService,
        EventBusService,
        AgentVerificationService,
        AgentFindingService,
    ],
})
export class CoreModule {}
