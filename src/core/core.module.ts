import { Module } from '@nestjs/common';
import {
    GetPromptsController,
    GetPromptByAgentController,
    GetLogsController,
    GetMetricsController,
    GetVerificationStatsController,
} from './controllers';

import { DatabaseService } from './database';
import { EventBusService } from '@/shared/events/event-bus.service';
import { AgentFindingService } from '@/shared/facts/services/agent-finding.service';
import { AgentVerificationService } from '@/shared/facts/services/agent-verification.service';
import { AgentLoggerService } from '@/shared/logger/agent-logger.service';
import { AgentPromptService } from '@/shared/prompts/agent-prompt.service';
import { SharedModule } from '@/shared/shared.module';

/**
 * Módulo central del sistema que expone endpoints para trazabilidad,
 * gestión de prompts, eventos, logs generados por los agentes y métricas del sistema.
 */
@Module({
    imports: [SharedModule],
    controllers: [
        GetPromptsController,
        GetPromptByAgentController,
        GetLogsController,
        GetMetricsController,
        GetVerificationStatsController,
    ],
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
