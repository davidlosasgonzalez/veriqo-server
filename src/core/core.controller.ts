import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { AgentEvent } from './database/entities/agent-event.entity';
import { AgentLog } from './database/entities/agent-log.entity';
import { AgentPrompt } from './database/entities/agent-prompt.entity';
import { AgentVerification } from './database/entities/agent-verification.entity';
import { EventBusService } from '@/shared/events/event-bus.service';
import { AgentFindingService } from '@/shared/facts/services/agent-finding.service';
import { AgentVerificationService } from '@/shared/facts/services/agent-verification.service';
import { AgentLoggerService } from '@/shared/logger/agent-logger.service';
import { AgentPromptService } from '@/shared/prompts/agent-prompt.service';
import { DataResponse } from '@/shared/types/http-response.type';

@ApiTags('core')
@Controller('core')
export class CoreController {
    constructor(
        private readonly logger: AgentLoggerService,
        private readonly prompts: AgentPromptService,
        private readonly events: EventBusService,
        private readonly verification: AgentVerificationService,
        private readonly findings: AgentFindingService,
    ) {}

    /**
     * Obtiene todos los logs técnicos generados por los agentes IA.
     */
    @Get('logs')
    @ApiOperation({
        summary: 'Obtener todos los logs registrados por los agentes',
    })
    @ApiOkResponse({ type: [AgentLog] })
    async getAgentLogs(): Promise<DataResponse<AgentLog[]>> {
        const data = await this.logger.findAll();
        return {
            status: 'ok',
            message: 'Logs obtenidos correctamente.',
            data,
        };
    }

    /**
     * Devuelve todos los prompts configurados por agente.
     */
    @Get('prompts')
    @ApiOperation({
        summary: 'Obtener todos los prompts activos por agente',
    })
    @ApiOkResponse({ type: [AgentPrompt] })
    async getAgentPrompts(): Promise<DataResponse<AgentPrompt[]>> {
        const data = await this.prompts.findAllPrompts();
        return {
            status: 'ok',
            message: 'Prompts obtenidos correctamente.',
            data,
        };
    }

    /**
     * Devuelve todos los eventos registrados en el bus de agentes.
     */
    @Get('events')
    @ApiOperation({
        summary: 'Obtener todos los eventos emitidos por los agentes',
    })
    @ApiOkResponse({ type: [AgentEvent] })
    async getAgentEvents(): Promise<DataResponse<AgentEvent[]>> {
        const data = await this.events.findAllEvents();
        return {
            status: 'ok',
            message: 'Eventos obtenidos correctamente.',
            data,
        };
    }

    /**
     * Genera un resumen estadístico del uso de motores de búsqueda.
     */
    @Get('log-summary')
    @ApiOperation({
        summary: 'Obtener resumen del uso de motores de búsqueda',
    })
    async getLogSummary(): Promise<DataResponse<any>> {
        const data = await this.logger.getStats();
        return {
            status: 'ok',
            message: 'Resumen de logs obtenidos correctamente.',
            data,
        };
    }

    /**
     * Devuelve métricas globales de verificación factual (hallazgos, cobertura, categorías).
     */
    @Get('metrics')
    @ApiOperation({
        summary: 'Obtener métricas globales de verificación factual',
    })
    async getVerificationMetrics(): Promise<DataResponse<any>> {
        const data = await this.verification.findAll();
        return {
            status: 'ok',
            message: 'Métricas obtenidas correctamente.',
            data,
        };
    }
}
