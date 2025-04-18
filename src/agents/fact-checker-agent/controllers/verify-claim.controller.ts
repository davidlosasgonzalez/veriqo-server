import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExecuteFactCheckerDto } from '../dto/execute-fact-checker.dto';
import { VerifyClaimService } from '../services';

/**
 * Controlador encargado de verificar afirmaciones textuales.
 */
@ApiTags('Fact-checker')
@Controller('facts')
export class VerifyClaimController {
    constructor(private readonly verifyClaimService: VerifyClaimService) {}

    /**
     * Verifica una afirmación y devuelve el fact generado.
     * @param executeFactCheckerDto Datos necesarios para la verificación.
     * @returns Fact verificado con fuentes y resumen.
     */
    @Post('verifications')
    @ApiOperation({
        summary: 'Verifica una afirmación textual y genera un fact',
    })
    async execute(@Body() executeFactCheckerDto: ExecuteFactCheckerDto) {
        const result = await this.verifyClaimService.execute(
            executeFactCheckerDto,
        );

        return {
            status: 'ok',
            message: 'Verificación completada.',
            data: result,
        };
    }
}
