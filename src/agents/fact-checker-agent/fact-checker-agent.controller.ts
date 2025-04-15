import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { FactCheckerAgentService } from './fact-checker-agent.service';
import { AgentLog } from '@/database/entities/agent-log.entity';
import { AgentPrompt } from '@/database/entities/agent-prompt.entity';
import { AgentSource } from '@/database/entities/agent-sources.entity';
import { AgentFactService } from '@/shared/facts/agent-fact.service';
import { AgentVerificationService } from '@/shared/facts/agent-verification.service';
import { AgentLoggerService } from '@/shared/logger/agent-logger.service';
import { AgentPromptService } from '@/shared/prompts/agent-prompt.service';
import { DataResponse } from '@/shared/types/base-response.type';

@ApiTags('Fact Checker Agent')
@Controller('agents/fact-checker')
export class FactCheckerAgentController {
    constructor(
        private readonly factCheckerService: FactCheckerAgentService,
        private readonly factService: AgentFactService,
        private readonly verificationService: AgentVerificationService,
        private readonly promptService: AgentPromptService,
        private readonly loggerService: AgentLoggerService,
    ) {}

    @Get('last')
    @ApiOperation({
        summary: 'Devuelve la última verificación factual realizada',
    })
    async getLastVerification(): Promise<DataResponse<any>> {
        const result = this.factCheckerService.getLastResult();
        return {
            status: 'ok',
            message: 'Última verificación obtenida.',
            data: result,
        };
    }

    @Get('facts/:claim')
    @ApiOperation({
        summary: 'Devuelve una verificación específica si ya fue realizada',
    })
    @ApiParam({ name: 'claim' })
    async getFactByClaim(
        @Param('claim') claim: string,
    ): Promise<DataResponse<any>> {
        const fact = await this.factService.getFactByClaim(claim);
        const verification =
            await this.verificationService.getVerificationByClaim(claim);
        return {
            status: 'ok',
            message: 'Resultado recuperado.',
            data: fact
                ? {
                      ...fact,
                      reasoning: verification?.reasoning ?? '',
                      sources_retrieved: verification?.sourcesRetrieved ?? [],
                      sources_used: verification?.sourcesUsed ?? [],
                  }
                : null,
        };
    }

    @Get('history')
    @ApiOperation({
        summary: 'Devuelve el historial completo de verificaciones',
    })
    async getHistory(): Promise<DataResponse<any[]>> {
        const facts = await this.factService.getAllFacts();
        const enriched = await Promise.all(
            facts.map(async (fact) => {
                const verification =
                    await this.verificationService.getVerificationByClaim(
                        fact.claim,
                    );
                return {
                    ...fact,
                    reasoning: verification?.reasoning ?? '',
                    sources_retrieved: verification?.sourcesRetrieved ?? [],
                    sources_used: verification?.sourcesUsed ?? [],
                };
            }),
        );
        return {
            status: 'ok',
            message: 'Historial cargado correctamente.',
            data: enriched,
        };
    }

    @Get('logs')
    @ApiOperation({ summary: 'Devuelve el historial de uso de los agentes' })
    async getLogs(): Promise<DataResponse<AgentLog[]>> {
        const logs = await this.loggerService.getAllLogs();
        return {
            status: 'ok',
            message: 'Historial de logs cargado correctamente.',
            data: logs,
        };
    }

    @Get('prompts')
    @ApiOperation({ summary: 'Devuelve los prompts base de todos los agentes' })
    async getPrompts(): Promise<DataResponse<AgentPrompt[]>> {
        const prompts = await this.promptService.getAllPrompts();
        return {
            status: 'ok',
            message: 'Prompts cargados correctamente.',
            data: prompts,
        };
    }

    @Get('sources')
    @ApiOperation({ summary: 'Devuelve todas las fuentes registradas' })
    async getAllSources(): Promise<DataResponse<AgentSource[]>> {
        const sources = await this.verificationService.getAllSources();
        return {
            status: 'ok',
            message: 'Fuentes obtenidas correctamente.',
            data: sources,
        };
    }

    @Get('insights')
    @ApiOperation({ summary: 'Estadísticas globales de verificaciones' })
    async getStats(): Promise<DataResponse<any>> {
        const total = await this.factService.countAllFacts();
        const byVerdict = await this.verificationService.countByVerdict();
        return {
            status: 'ok',
            message: 'Estadísticas generadas.',
            data: {
                totalVerificaciones: total,
                porVeredicto: byVerdict,
            },
        };
    }
}
