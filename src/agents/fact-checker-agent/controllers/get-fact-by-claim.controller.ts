import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { ExecuteFactCheckerDto } from '../dto/execute-fact-checker.dto';
import { GetFactByClaimService } from '../services';
import { AgentFactDto } from '@/shared/facts/dto/agent-fact.dto';

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
     * Retorna un DTO limpio sin campos internos como `embedding`.
     *
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

        const dto = plainToInstance(AgentFactDto, result, {
            excludeExtraneousValues: true,
        });

        return {
            status: 'ok',
            message: 'Fact recuperado correctamente.',
            data: dto,
        };
    }
}
