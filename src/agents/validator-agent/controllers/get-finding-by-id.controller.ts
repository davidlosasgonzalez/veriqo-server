import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';
import { GetFindingByIdService } from '../services';

/**
 * Controlador para obtener un finding específico por su ID.
 */
@ApiTags('Validators')
@Controller('validators')
export class GetFindingByIdController {
    constructor(
        private readonly getFindingByIdService: GetFindingByIdService,
    ) {}

    /**
     * Recupera un finding único por su UUID.
     * @param findingId Identificador del finding.
     * @returns Detalle del finding solicitado.
     */
    @Get('findings/:findingId')
    @ApiParam({
        name: 'findingId',
        description: 'ID del finding',
        type: 'string',
        format: 'uuid',
    })
    @ApiOperation({ summary: 'Obtiene un finding por su ID' })
    async execute(@Param('findingId', ParseUUIDPipe) findingId: string) {
        const result = await this.getFindingByIdService.execute(findingId);

        return {
            status: 'ok',
            message: 'Finding recuperado correctamente.',
            data: result,
        };
    }
}
