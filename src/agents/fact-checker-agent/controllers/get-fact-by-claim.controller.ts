import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExecuteFactCheckerDto } from '../dto/execute-fact-checker.dto';
import { GetFactByClaimService } from '../services';

/**
 * Controlador que permite recuperar un fact previamente generado para una afirmación dada.
 */
@ApiTags('Facts')
@Controller('facts')
export class GetFactByClaimController {
    constructor(
        private readonly getFactByClaimService: GetFactByClaimService,
    ) {}

    /**
     * Busca un fact verificado equivalente a una afirmación textual.
     * @param executeFactCheckerDto DTO con el texto del claim original.
     * @returns Fact equivalente si fue verificado previamente.
     */
    @Post('claim')
    @ApiOperation({
        summary:
            'Busca un fact previamente verificado para una afirmación textual.',
    })
    async execute(@Body() executeFactCheckerDto: ExecuteFactCheckerDto) {
        const result = await this.getFactByClaimService.execute(
            executeFactCheckerDto,
        );

        return {
            status: 'ok',
            message: 'Fact recuperado correctamente.',
            data: result,
        };
    }
}
