import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';
import { GetVerificationByIdService } from '../services';

/**
 * Controlador para recuperar una verificación factual por su ID.
 */
@ApiTags('Facts')
@Controller('facts')
export class GetVerificationByIdController {
    constructor(
        private readonly getVerificationByIdService: GetVerificationByIdService,
    ) {}

    /**
     * Devuelve una verificación factual identificada por su UUID.
     * @param verificationId ID único de la verificación factual.
     * @returns Verificación encontrada o null si no existe.
     */
    @Get('verifications/:verificationId')
    @ApiParam({
        name: 'verificationId',
        description: 'ID de la verificación factual',
        type: 'string',
        format: 'uuid',
    })
    @ApiOperation({
        summary: 'Obtiene una verificación factual por su ID',
    })
    async execute(
        @Param('verificationId', ParseUUIDPipe) verificationId: string,
    ) {
        const result =
            await this.getVerificationByIdService.execute(verificationId);

        return {
            status: 'ok',
            message: 'Verificación recuperada correctamente.',
            data: result,
        };
    }
}
