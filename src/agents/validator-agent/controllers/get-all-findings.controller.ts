import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAllFindingsService } from '../services';

/**
 * Controlador para obtener todos los findings generados por el ValidatorAgent.
 */
@ApiTags('Validator')
@Controller('validators')
export class GetAllFindingsController {
    constructor(
        private readonly getAllFindingsService: GetAllFindingsService,
    ) {}

    /**
     * Devuelve el listado de findings.
     * @returns Lista de findings registrados.
     */
    @Get('findings')
    @ApiOperation({ summary: 'Obtiene todos los findings paginados' })
    async execute() {
        const result = await this.getAllFindingsService.execute();

        return {
            status: 'ok',
            message: 'Findings recuperados correctamente.',
            data: result,
        };
    }
}
