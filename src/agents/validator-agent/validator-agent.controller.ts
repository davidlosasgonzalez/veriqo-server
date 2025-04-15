import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ExecuteValidatorDto } from './dto/execute-validator.dto';
import { ValidatorAgentService } from './validator-agent.service';
import { AgentFinding } from '@/database/entities/agent-findings.entity';
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
                        type: 'factual_error',
                        summary: '1 no es primo',
                        explanation:
                            'Por definición, un número primo es mayor que 1.',
                        suggestion: 'Sustituye 1 por 2.',
                        keywords: ['número primo', 'matemáticas'],
                        synonyms: ['número natural mayor que 1'],
                        needsFactCheck: true,
                        createdAt: '2025-04-14T12:00:00.000Z',
                        updatedAt: '2025-04-14T12:00:00.000Z',
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
        summary: 'Devuelve todos los findings detectados por ValidatorAgent',
    })
    async getFindings(): Promise<DataResponse<AgentFinding[]>> {
        const findings = await this.validatorAgentService.getAllFindings();

        return {
            status: 'ok',
            message: 'Findings recuperados correctamente.',
            data: findings,
        };
    }

    @Get('test')
    @ApiOperation({
        summary: 'Comprueba si el agente está activo (modo desarrollo).',
    })
    async test(): Promise<DataResponse<string>> {
        return {
            status: 'ok',
            message: 'El agente está activo.',
            data: 'ValidatorAgent operativo 🧠',
        };
    }
}
