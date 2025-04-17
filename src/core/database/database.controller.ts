import { Body, Controller, Post } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiBody,
    ApiCreatedResponse,
} from '@nestjs/swagger';
import { DatabaseService } from './database.service';
import { CreateAgentLogDto } from './dto/create-agent-log.dto';
import { AgentLog } from '@/core/database/entities/agent-log.entity';

@ApiTags('core')
@Controller('core/database')
export class DatabaseController {
    constructor(private readonly databaseService: DatabaseService) {}

    /**
     * Registra un nuevo log técnico generado por un agente IA.
     * Este log incluye el prompt, la respuesta, el modelo utilizado,
     * y otras métricas útiles para trazabilidad y debugging.
     *
     * @param body DTO con los datos del log a persistir
     * @returns El objeto `AgentLog` creado
     */
    @Post('log')
    @ApiOperation({ summary: 'Registrar un nuevo log de agente' })
    @ApiBody({ type: CreateAgentLogDto })
    @ApiCreatedResponse({
        description: 'Log registrado correctamente.',
        type: AgentLog,
    })
    async createLog(@Body() body: CreateAgentLogDto): Promise<AgentLog> {
        return this.databaseService.createLog(body);
    }
}
