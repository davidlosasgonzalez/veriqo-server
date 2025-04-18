import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AgentPromptService } from '@/shared/prompts/agent-prompt.service';

/**
 * Devuelve el prompt asociado a un agente específico.
 */
@ApiTags('Core')
@Controller('core')
export class GetPromptByAgentController {
    constructor(private readonly promptService: AgentPromptService) {}

    /**
     * Recupera el prompt asignado al agente especificado.
     * @param agent Nombre del agente (ej. 'validator_agent').
     */
    @Get('prompts/:agent')
    @ApiOperation({ summary: 'Obtiene el prompt de un agente específico.' })
    @ApiParam({ name: 'agent', example: 'validator_agent' })
    async execute(@Param('agent') agent: string) {
        const prompt = await this.promptService.findPromptByAgent(agent);

        return {
            status: 'ok',
            message: 'Prompt recuperado correctamente.',
            data: prompt,
        };
    }
}
