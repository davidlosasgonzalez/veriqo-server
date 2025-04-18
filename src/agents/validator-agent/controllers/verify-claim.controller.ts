import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExecuteValidatorDto } from '../dto/execute-validator.dto';
import { VerifyClaimService } from '../services';

/**
 * Controlador que permite verificar una afirmación para detectar contradicciones, errores o duplicados.
 */
@ApiTags('Validator')
@Controller('validators')
export class VerifyClaimController {
    constructor(private readonly verifyClaimService: VerifyClaimService) {}

    /**
     * Verifica una afirmación textual para determinar si necesita comprobación factual.
     * @param executeValidatorDto Afirmación y opciones de verificación.
     * @returns Finding de validación generado.
     */
    @Post('analyze')
    @ApiOperation({
        summary: 'Verifica si una afirmación necesita comprobación factual',
    })
    async execute(@Body() executeValidatorDto: ExecuteValidatorDto) {
        const result = await this.verifyClaimService.execute(
            executeValidatorDto.prompt,
        );

        return {
            status: 'ok',
            message: 'Afirmación validada correctamente.',
            data: result,
        };
    }
}
