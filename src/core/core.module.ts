import { Module } from '@nestjs/common';
import { CoreController } from './core.controller';
import { AgentVerificationService } from '@/shared/facts/agent-verification.service';
import { AgentLoggerService } from '@/shared/logger/agent-logger.service';
import { AgentPromptService } from '@/shared/prompts/agent-prompt.service';

@Module({
    controllers: [CoreController],
    providers: [
        AgentLoggerService,
        AgentPromptService,
        AgentVerificationService,
    ],
})
export class CoreModule {}
