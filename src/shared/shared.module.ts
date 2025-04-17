import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClaudeEmbeddingService } from './embeddings/claude-embedding.service';
import { OpenAIEmbeddingService } from './embeddings/openai-embedding.service';

import { EventBusService } from './events/event-bus.service';

import { FactCheckAwaitService } from './facts/runtime/fact-check-await.service';
import { FactCheckLockService } from './facts/runtime/fact-check-lock.service';
import { AgentFactService } from './facts/services/agent-fact.service';
import { AgentFindingService } from './facts/services/agent-finding.service';
import { AgentVerificationService } from './facts/services/agent-verification.service';

import { ClaudeChatService } from './llm/claude-chat.service';
import { LlmRouterService } from './llm/llm-router.service';
import { OpenAIChatService } from './llm/openai-chat.service';

import { AgentLoggerService } from './logger/agent-logger.service';
import { AgentPromptService } from './prompts/agent-prompt.service';

import { BraveSearchService } from './search/brave-search.service';
import { FallbackSearchService } from './search/fallback-search.service';
import { GoogleSearchService } from './search/google-search.service';
import { NewsSearchService } from './search/news-search.service';

import { AgentEvent } from '@/core/database/entities/agent-event.entity';
import { AgentFact } from '@/core/database/entities/agent-fact.entity';
import { AgentFinding } from '@/core/database/entities/agent-finding.entity';
import { AgentLog } from '@/core/database/entities/agent-log.entity';
import { AgentPrompt } from '@/core/database/entities/agent-prompt.entity';
import { AgentSource } from '@/core/database/entities/agent-source.entity';
import { AgentVerification } from '@/core/database/entities/agent-verification.entity';
import { PromptSeeder } from '@/core/database/seeders/prompt.seeder';

/**
 * Módulo compartido entre todos los agentes y componentes del sistema.
 * Centraliza servicios reutilizables como eventos, embeddings, búsqueda, logging, etc.
 */
@Module({
    imports: [
        EventEmitterModule.forRoot(),
        HttpModule,
        TypeOrmModule.forFeature([
            AgentEvent,
            AgentFact,
            AgentFinding,
            AgentLog,
            AgentPrompt,
            AgentSource,
            AgentVerification,
        ]),
    ],
    providers: [
        // Loggers
        AgentLoggerService,

        // Events
        EventBusService,

        // LLM
        OpenAIChatService,
        ClaudeChatService,
        LlmRouterService,

        // Prompts
        AgentPromptService,

        // Embeddings
        OpenAIEmbeddingService,
        ClaudeEmbeddingService,

        // Facts
        AgentFactService,
        AgentFindingService,
        AgentVerificationService,
        FactCheckAwaitService,
        FactCheckLockService,

        // Search
        BraveSearchService,
        GoogleSearchService,
        NewsSearchService,
        FallbackSearchService,

        // Seeder
        PromptSeeder,
    ],
    exports: [
        // Loggers
        AgentLoggerService,

        // Events
        EventBusService,

        // LLM
        OpenAIChatService,
        ClaudeChatService,
        LlmRouterService,

        // Prompts
        AgentPromptService,

        // Embeddings
        OpenAIEmbeddingService,
        ClaudeEmbeddingService,

        // Facts
        AgentFactService,
        AgentFindingService,
        AgentVerificationService,
        FactCheckAwaitService,
        FactCheckLockService,

        // Search
        BraveSearchService,
        GoogleSearchService,
        NewsSearchService,
        FallbackSearchService,

        // ORM exports para otros módulos
        TypeOrmModule,
    ],
})
export class SharedModule {}
