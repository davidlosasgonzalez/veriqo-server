import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { FactDto } from '../../../../../shared/presentation/dto/fact.dto';
import { FindingDto } from '../dto/finding.dto';
import { VerifyClaimDto } from '../dto/verify-claim.dto';
import { mapToFindingDto } from '../mappers/finding.mapper';

import { FindAllFindingsQuery } from '@/agents/validator-agent/application/queries/finding/find-all-findings.query';
import { GetFindingByClaimQuery } from '@/agents/validator-agent/application/queries/finding/get-finding-by-claim.query';
import { GetFindingByIdQuery } from '@/agents/validator-agent/application/queries/finding/get-finding-by-id.use-query';
import { GetFindingByClaimPayload } from '@/agents/validator-agent/application/queries/finding/payloads/get-finding-by-claim.payload';
import { VerifyClaimOrchestratorService } from '@/agents/validator-agent/application/services/verify-claim-orchestrator.service';
import { Finding } from '@/agents/validator-agent/domain/entities/finding';
import { GetFactByIdQuery } from '@/shared/application/queries/fact/get-fact-by-id.query';
import { DataResponse } from '@/shared/types/http-response.type';

@ApiTags('Validator')
@Controller('validators')
export class ValidatorAgentController {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly verifyClaimOrchestrator: VerifyClaimOrchestratorService,
    ) {}

    @Post('analyze')
    @ApiOperation({
        summary: 'Analiza un texto libre y verifica sus afirmaciones',
    })
    @ApiResponse({
        status: 201,
        description: 'Afirmaciones extraídas, verificadas y almacenadas.',
    })
    async analyzeTextFromFreeInput(
        @Body() verifyClaimDto: VerifyClaimDto,
    ): Promise<DataResponse<FindingDto[]>> {
        const findings = await this.verifyClaimOrchestrator.execute({
            payload: verifyClaimDto,
        });

        return {
            status: 'ok',
            message: 'Afirmaciones extraídas y verificadas.',
            data: findings.map(mapToFindingDto),
        };
    }

    @Get('findings/by-claim')
    @ApiOperation({
        summary:
            'Busca un hallazgo equivalente a un claim normalizado (texto exacto)',
    })
    @ApiResponse({
        status: 200,
        description: 'Finding encontrado si existe, o null.',
    })
    async getFindingByClaim(
        @Query('text') text: string,
    ): Promise<DataResponse<FindingDto>> {
        const payload: GetFindingByClaimPayload = { claim: text };
        const finding = await this.queryBus.execute(
            new GetFindingByClaimQuery(payload),
        );

        return {
            status: 'ok',
            message: 'Hallazgo encontrado.',
            data: plainToInstance(FindingDto, finding, {
                excludeExtraneousValues: true,
            }),
        };
    }

    @Get('findings/:id')
    @ApiOperation({ summary: 'Obtiene un hallazgo completo por ID' })
    @ApiResponse({
        status: 200,
        description: 'Hallazgo recuperado correctamente.',
    })
    async getFinding(
        @Param('id') id: string,
    ): Promise<DataResponse<FindingDto>> {
        const finding: Finding = await this.queryBus.execute(
            new GetFindingByIdQuery({ id }),
        );

        return {
            status: 'ok',
            message: 'Hallazgo recuperado.',
            data: mapToFindingDto(finding),
        };
    }

    @Get('findings')
    @ApiOperation({ summary: 'Lista todos los hallazgos (uso interno)' })
    async findAllFindings(): Promise<DataResponse<FindingDto[]>> {
        const findings = await this.queryBus.execute(
            new FindAllFindingsQuery(),
        );

        return {
            status: 'ok',
            message: 'Lista de hallazgos obtenida.',
            data: findings.map(mapToFindingDto),
        };
    }

    @Get('facts/:id')
    @ApiOperation({ summary: 'Recupera un fact verificado por ID' })
    @ApiResponse({
        status: 200,
        description: 'Fact recuperado correctamente.',
    })
    async getFactById(@Param('id') id: string): Promise<DataResponse<FactDto>> {
        const fact = await this.queryBus.execute(new GetFactByIdQuery({ id }));

        return {
            status: 'ok',
            message: 'Fact recuperado.',
            data: fact,
        };
    }
}
