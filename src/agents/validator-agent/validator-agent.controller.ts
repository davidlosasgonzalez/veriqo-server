import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiBody,
    ApiResponse,
    ApiParam,
} from '@nestjs/swagger';
import { ExecuteValidatorDto } from './dto/execute-validator.dto';
import { ValidatorAgentService } from './validator-agent.service';
import { DataResponse } from '@/shared/types/base-response.type';
import { ValidationFinding } from '@/shared/types/validation-finding.type';

@ApiTags('Validator Agent')
@Controller('agents/validator')
export class ValidatorAgentController {
    constructor(
        private readonly validatorAgentService: ValidatorAgentService,
    ) {}

    @Post()
    @ApiOperation({
        summary: 'Analiza un texto y detecta contradicciones o errores.',
    })
    @ApiBody({ type: ExecuteValidatorDto })
    @ApiResponse({
        status: 200,
        description: 'Texto analizado correctamente.',
        schema: {
            example: {
                status: 'ok',
                message: 'Texto analizado correctamente.',
                data: [
                    {
                        id: 'bbde9314-5011-46e0-aea1-f4bcae91e5c3',
                        claim: 'El número primo más pequeño es 1',
                        category: 'factual_error',
                        summary: '1 no es primo',
                        explanation:
                            'Por definición, un número primo es mayor que 1.',
                        suggestion: 'Sustituye 1 por 2.',
                        keywords: ['número primo', 'matemáticas'],
                        synonyms: {
                            'número primo': ['divisible solo por 1 y sí mismo'],
                        },
                        needsFactCheck: true,
                        searchQuery: '"número primo más pequeño"',
                    },
                ],
            },
        },
    })
    async execute(
        @Body() executeValidatorDto: ExecuteValidatorDto,
    ): Promise<DataResponse<ValidationFinding[]>> {
        const result = await this.validatorAgentService.execute(
            executeValidatorDto.prompt,
        );

        return {
            status: 'ok',
            message: 'Texto analizado correctamente.',
            data: result,
        };
    }

    @Get('findings')
    @ApiOperation({
        summary:
            'Devuelve todos los hallazgos generados por el ValidatorAgent.',
    })
    async getAllFindings(): Promise<DataResponse<ValidationFinding[]>> {
        const findings = await this.validatorAgentService.getAllFindings();
        return {
            status: 'ok',
            message: 'Hallazgos encontrados correctamente.',
            data: findings,
        };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Devuelve un hallazgo concreto por su ID.' })
    @ApiParam({ name: 'id', example: 'uuid-válido-del-finding' })
    async getFindingById(
        @Param('id') id: string,
    ): Promise<DataResponse<ValidationFinding | null>> {
        const finding = await this.validatorAgentService.getFindingById(id);
        return {
            status: 'ok',
            message: finding ? 'Hallazgo recuperado.' : 'No encontrado.',
            data: finding,
        };
    }
}
