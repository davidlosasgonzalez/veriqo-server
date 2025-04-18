import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';
import { GetFactHistoryService } from '../services';

/**
 * Controlador que devuelve todos los findings relacionados a un fact verificado previamente.
 */
@ApiTags('Facts')
@Controller('facts')
export class GetFactHistoryController {
    constructor(
        private readonly getFactHistoryService: GetFactHistoryService,
    ) {}

    /**
     * Obtiene el historial de findings relacionados a un fact verificado.
     * @param factId UUID del fact verificado.
     * @returns Lista de findings asociados a dicho fact.
     */
    @Get('verifications/:factId/history')
    @ApiParam({
        name: 'factId',
        description: 'ID del fact verificado',
        type: 'string',
        format: 'uuid',
    })
    @ApiOperation({
        summary:
            'Obtiene el historial de findings asociados a un fact verificado',
    })
    async execute(@Param('factId', ParseUUIDPipe) factId: string) {
        const result = await this.getFactHistoryService.execute(factId);

        return {
            status: 'ok',
            message: 'Historial de fact recuperado correctamente.',
            data: result,
        };
    }
}
