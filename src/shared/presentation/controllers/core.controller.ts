import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetAgentLogsQuery } from '@/shared/application/queries/core/get-agent-logs.query';
import { GetPromptsQuery } from '@/shared/application/queries/core/get-prompts.query';
import { GetServerMetricsUseCase } from '@/shared/application/use-cases/read/core/get-server-metrics.use-case';
import { GetVerificationStatsUseCase } from '@/shared/application/use-cases/read/core/get-verification-stats.use-case';
import { AgentLogDto } from '@/shared/presentation/dto/agent-log.dto';
import { AgentPromptDto } from '@/shared/presentation/dto/agent-prompt.dto';
import { ServerMetricsDto } from '@/shared/presentation/dto/server-metrics.dto';
import { VerificationStatsDto } from '@/shared/presentation/dto/verification-stats.dto';
import { DataResponse } from '@/shared/types/http-response.type';

@ApiTags('Core')
@Controller('core')
export class CoreController {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly getVerificationStats: GetVerificationStatsUseCase,
        private readonly getServerMetrics: GetServerMetricsUseCase,
    ) {}

    @Get('logs')
    @ApiOperation({ summary: 'Devuelve todos los logs registrados.' })
    @ApiResponse({
        status: 200,
        description: 'Logs recuperados correctamente.',
    })
    async getLogs(): Promise<DataResponse<AgentLogDto[]>> {
        const logs = await this.queryBus.execute(new GetAgentLogsQuery());

        return {
            status: 'ok',
            message: 'Logs recuperados correctamente.',
            data: logs,
        };
    }

    @Get('prompts')
    @ApiOperation({ summary: 'Devuelve todos los prompts configurados.' })
    @ApiResponse({
        status: 200,
        description: 'Prompts recuperados correctamente.',
    })
    async getPrompts(): Promise<DataResponse<AgentPromptDto[]>> {
        const prompts = await this.queryBus.execute(new GetPromptsQuery());

        return {
            status: 'ok',
            message: 'Prompts recuperados correctamente.',
            data: prompts,
        };
    }

    @Get('stats')
    @ApiOperation({ summary: 'Devuelve métricas de verificación factual.' })
    @ApiResponse({
        status: 200,
        description: 'Métricas de verificación factual obtenidas.',
    })
    async getStats(): Promise<DataResponse<VerificationStatsDto>> {
        const stats = await this.getVerificationStats.execute();

        return {
            status: 'ok',
            message: 'Métricas de verificación factual obtenidas.',
            data: stats,
        };
    }

    @Get('metrics')
    @ApiOperation({ summary: 'Devuelve métricas técnicas del servidor.' })
    @ApiResponse({
        status: 200,
        description: 'Métricas técnicas obtenidas correctamente.',
    })
    async getMetrics(): Promise<DataResponse<ServerMetricsDto>> {
        const metrics = await this.getServerMetrics.execute();

        return {
            status: 'ok',
            message: 'Métricas técnicas obtenidas correctamente.',
            data: metrics,
        };
    }
}
