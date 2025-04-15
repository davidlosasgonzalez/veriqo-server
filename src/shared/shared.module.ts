import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClaudeChatService } from './ai/claude-chat.service';
import { OpenAIChatService } from './ai/openai-chat.service';
import { EventBusService } from './events/event-bus.service';
import { AgentFactService } from './facts/agent-fact.service';
import { AgentFindingService } from './facts/agent-finding.service';
import { AgentVerificationService } from './facts/agent-verification.service';
import { AgentLoggerService } from './logger/agent-logger.service';
import { AgentPromptService } from './prompts/agent-prompt.service';
import { BraveSearchService } from './search/brave-search.service';
import { GoogleSearchService } from './search/google-search.service';
import { AgentEvent } from '@/database/entities/agent-events.entity';
import { AgentFact } from '@/database/entities/agent-facts.entity';
import { AgentFinding } from '@/database/entities/agent-findings.entity';
import { AgentLog } from '@/database/entities/agent-log.entity';
import { AgentPrompt } from '@/database/entities/agent-prompt.entity';
import { AgentSource } from '@/database/entities/agent-sources.entity';
import { AgentVerification } from '@/database/entities/agent-verifications.entity';
import { PromptSeeder } from '@/database/seeders/prompt.seeder';

@Module({
    imports: [
        EventEmitterModule.forRoot(),
        TypeOrmModule.forFeature([
            AgentPrompt,
            AgentFact,
            AgentSource,
            AgentVerification,
            AgentEvent,
            AgentFinding,
            AgentLog,
        ]),
        HttpModule,
    ],
    providers: [
        EventBusService,
        AgentLoggerService,
        AgentVerificationService,
        AgentPromptService,
        AgentFactService,
        AgentFindingService,
        OpenAIChatService,
        ClaudeChatService,
        BraveSearchService,
        GoogleSearchService,
        PromptSeeder,
    ],
    exports: [
        EventBusService,
        AgentLoggerService,
        AgentVerificationService,
        AgentPromptService,
        AgentFactService,
        AgentFindingService,
        OpenAIChatService,
        ClaudeChatService,
        BraveSearchService,
        GoogleSearchService,
        TypeOrmModule,
    ],
})
export class SharedModule {}
