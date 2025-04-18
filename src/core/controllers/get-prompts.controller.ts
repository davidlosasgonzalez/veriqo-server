import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AgentPromptService } from '@/shared/prompts/agent-prompt.service';

/**
 * Devuelve todos los prompts configurados por agente.
 */
@ApiTags('Core')
@Controller('core')
export class GetPromptsController {
    constructor(private readonly promptService: AgentPromptService) {}

    /**
     * Recupera todos los prompts registrados en base de datos.
     */
    @Get('prompts')
    @ApiOperation({ summary: 'Obtiene todos los prompts disponibles.' })
    async execute() {
        const prompts = await this.promptService.findAllPrompts();

        return {
            status: 'ok',
            message: 'Prompts recuperados correctamente.',
            data: prompts,
        };
    }
}
