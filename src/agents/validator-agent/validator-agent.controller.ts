import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiBody,
    ApiResponse,
    ApiParam,
} from '@nestjs/swagger';
import { ExecuteValidatorDto } from './dto/execute-validator.dto';
import { ValidationFindingDto } from './dto/validation-finding.dto';
import { ValidatorAgentService } from './validator-agent.service';
import { DataResponse } from '@/shared/types/http-response.type';

@ApiTags('Validator Agent')
@Controller('agents/validator')
export class ValidatorAgentController {
    constructor(
        private readonly validatorAgentService: ValidatorAgentService,
    ) {}

    /**
     * Analiza un texto y detecta posibles errores, contradicciones u omisiones.
     * Puede emitir eventos para verificación factual si es necesario.
     */
    @Post()
    @ApiOperation({
        summary: 'Analiza un texto y detecta contradicciones o errores.',
    })
    @ApiBody({ type: ExecuteValidatorDto })
    @ApiResponse({
        status: 200,
        description: 'Texto analizado correctamente.',
        type: ValidationFindingDto,
        isArray: true,
    })
    async execute(
        @Body() executeValidatorDto: ExecuteValidatorDto,
    ): Promise<DataResponse<ValidationFindingDto[]>> {
        const result = await this.validatorAgentService.verifyClaim(
            executeValidatorDto.prompt,
            executeValidatorDto.waitForFact ?? false,
        );

        const dtoResult = result.map(
            (finding) => new ValidationFindingDto(finding),
        );

        return {
            status: 'ok',
            message: 'Texto analizado correctamente.',
            data: dtoResult,
        };
    }

    /**
     * Devuelve todos los hallazgos realizados por el ValidatorAgent.
     */
    @Get('findings')
    @ApiOperation({
        summary:
            'Devuelve todos los hallazgos generados por el ValidatorAgent.',
    })
    @ApiResponse({
        status: 200,
        type: ValidationFindingDto,
        isArray: true,
    })
    async getAllFindings(): Promise<DataResponse<ValidationFindingDto[]>> {
        const findings = await this.validatorAgentService.getAllFindings();
        const dtoResult = findings.map(
            (finding) => new ValidationFindingDto(finding),
        );

        return {
            status: 'ok',
            message: 'Hallazgos encontrados correctamente.',
            data: dtoResult,
        };
    }

    /**
     * Busca un hallazgo concreto por su ID único.
     * @param findingId UUID del hallazgo
     */
    @Get(':findingId')
    @ApiOperation({ summary: 'Devuelve un hallazgo concreto por su ID.' })
    @ApiParam({ name: 'findingId', example: 'uuid-válido-del-finding' })
    @ApiResponse({
        status: 200,
        type: ValidationFindingDto,
    })
    async getFindingById(
        @Param('findingId') findingId: string,
    ): Promise<DataResponse<ValidationFindingDto | null>> {
        const finding =
            await this.validatorAgentService.getFindingById(findingId);

        return {
            status: 'ok',
            message: finding ? 'Hallazgo recuperado.' : 'No encontrado.',
            data: finding ? new ValidationFindingDto(finding) : null,
        };
    }
}
