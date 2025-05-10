import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { VerifyFactDto } from '../dto/verify-fact.dto';

import { VerifyFactCommand } from '@/agents/fact-checker/application/commands/verify/verify-fact.command';
import { VerifyFactUseCase } from '@/agents/fact-checker/application/use-cases/write/fact/verify-fact.use-case';
import { GetVerificationByIdQuery } from '@/shared/application/queries/verification/get-verification-by-id.query';
import { Verification } from '@/shared/domain/entities/verification';
import { DataResponse } from '@/shared/types/http-response.type';

@ApiTags('Fact Checker')
@Controller('facts')
export class FactCheckerAgentController {
    constructor(
        private readonly verifyFactUseCase: VerifyFactUseCase,
        private readonly queryBus: QueryBus,
    ) {}

    /**
     * Este endpoint no se utiliza en producción no tiene un uso real por el momento.
     *
     * Las verificaciones son desencadenadas automáticamente por eventos (FactualCheckRequiredEvent), en lugar
     * de ser iniciadas manualmente por peticiones HTTP. Esta decisión forma parte del diseño basado en eventos
     * y separación de responsabilidades, donde el segundo agente (FactChecker) actúa de forma autónoma al recibir
     * eventos del primero (Validator). Se conserva el endpoint para pruebas manuales, debugging o posible uso
     * futuro en herramientas de administración.
     **/
    @Post('verify')
    @ApiOperation({
        summary: 'Verifica una afirmación usando fuentes externas',
    })
    @ApiResponse({
        status: 201,
        description: 'Verificación factual creada.',
    })
    async verifyFact(
        @Body() dto: VerifyFactDto,
    ): Promise<DataResponse<Verification>> {
        const result = await this.verifyFactUseCase.execute(
            new VerifyFactCommand({ claim: dto.claim }),
        );

        return {
            status: 'ok',
            message: 'Verificación factual realizada.',
            data: result,
        };
    }

    @Get('verifications/:id')
    @ApiOperation({ summary: 'Obtiene una verificación por ID' })
    @ApiResponse({
        status: 200,
        description: 'Verificación encontrada.',
    })
    async getVerificationById(
        @Param('id') id: string,
    ): Promise<DataResponse<Verification>> {
        const result = await this.queryBus.execute(
            new GetVerificationByIdQuery({ id }),
        );

        return {
            status: 'ok',
            message: 'Verificación recuperada.',
            data: result,
        };
    }
}
