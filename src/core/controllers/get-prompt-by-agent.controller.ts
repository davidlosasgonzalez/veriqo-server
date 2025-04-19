import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AgentPromptService } from '@/shared/prompts/agent-prompt.service';

/**
 * Devuelve el prompt asociado a un agente y clave específica.
 */
@ApiTags('Core')
@Controller('core')
export class GetPromptByAgentController {
    constructor(private readonly promptService: AgentPromptService) {}

    /**
     * Recupera un prompt concreto asignado a un agente y clave.
     *
     * @param agent Nombre del agente (ej. 'validator_agent').
     * @param key Clave del prompt (ej. 'VALIDATOR_ANALYZE_MULTICLAIM').
     */
    @Get('prompts/:agent')
    @ApiOperation({
        summary:
            'Obtiene el prompt dinámico de un agente específico por clave.',
    })
    @ApiParam({ name: 'agent', example: 'validator_agent' })
    @ApiQuery({ name: 'key', example: 'VALIDATOR_ANALYZE_MULTICLAIM' })
    async execute(@Param('agent') agent: string, @Query('key') key: string) {
        const prompt = await this.promptService.getPrompt(agent, key);

        return {
            status: 'ok',
            message: 'Prompt recuperado correctamente.',
            data: prompt,
        };
    }
}
