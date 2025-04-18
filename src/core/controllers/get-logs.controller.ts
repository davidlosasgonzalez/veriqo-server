import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AgentLoggerService } from '@/shared/logger/agent-logger.service';

/**
 * Devuelve todos los logs generados por los agentes.
 */
@ApiTags('Core')
@Controller('core')
export class GetLogsController {
    constructor(private readonly logger: AgentLoggerService) {}

    /**
     * Recupera todos los logs disponibles en la base de datos.
     */
    @Get('logs')
    @ApiOperation({ summary: 'Obtiene todos los logs de agentes.' })
    async execute() {
        const logs = await this.logger.findAll();

        return {
            status: 'ok',
            message: 'Logs recuperados correctamente.',
            data: logs,
        };
    }
}
