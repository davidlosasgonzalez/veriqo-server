import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetLastVerificationService } from '../services';

/**
 * Controlador para obtener la última verificación factual registrada.
 */
@ApiTags('Facts')
@Controller('facts')
export class GetLastVerificationController {
    constructor(
        private readonly getLastResultService: GetLastVerificationService,
    ) {}

    /**
     * Recupera la última verificación factual almacenada en base de datos.
     * @returns Verificación más reciente si existe.
     */
    @Get('verifications/last')
    @ApiOperation({
        summary: 'Recupera la última verificación factual registrada.',
    })
    async execute() {
        const result = await this.getLastResultService.execute();

        return {
            status: 'ok',
            message: 'Última verificación recuperada.',
            data: result,
        };
    }
}
