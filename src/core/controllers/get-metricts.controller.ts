import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * Devuelve métricas básicas.
 */
@ApiTags('Core')
@Controller('core')
export class GetMetricsController {
    /**
     * Endpoint para obtener métricas operativas del backend.
     * @returns Objeto con métricas básicas (puede extenderse con Prometheus, etc.)
     */
    @Get('metrics')
    @ApiOperation({ summary: 'Devuelve métricas internas del backend' })
    execute() {
        return {
            status: 'ok',
            message: 'Métricas obtenidas correctamente.',
            data: {
                uptime: process.uptime(),
                timestamp: new Date().toISOString(),
                memoryUsage: process.memoryUsage(),
                env: process.env.NODE_ENV || 'development',
            },
        };
    }
}
