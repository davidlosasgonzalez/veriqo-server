import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CoreService } from './core.service';
import { DataResponse } from '@/shared/types/http-response.type';

@ApiTags('Core')
@Controller('core')
export class CoreController {
    constructor(private readonly coreService: CoreService) {}

    @Get('logs')
    @ApiOperation({ summary: 'Devuelve todos los logs registrados.' })
    @ApiResponse({
        status: 200,
        description: 'Logs recuperados correctamente.',
    })
    async getLogs(): Promise<DataResponse<any[]>> {
        const logs = await this.coreService.getLogs();

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
    async getPrompts(): Promise<DataResponse<any[]>> {
        const prompts = await this.coreService.getPrompts();

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
    async getStats(): Promise<DataResponse<any>> {
        const stats = await this.coreService.getStats();

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
    async getMetrics(): Promise<DataResponse<any>> {
        const metrics = await this.coreService.getMetrics();

        return {
            status: 'ok',
            message: 'Métricas técnicas obtenidas correctamente.',
            data: metrics,
        };
    }
}
