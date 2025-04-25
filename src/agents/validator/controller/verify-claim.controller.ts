import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VerifyClaimDto } from '../dto/verify-claim.dto';
import { VerifyClaimService } from '../services/verify-claim.service';
import { AgentFact } from '@/domain/entities/agent-fact.entity';
import { AgentFinding } from '@/domain/entities/agent-finding.entity';
import { DataResponse } from '@/shared/types/http-response.type';

@ApiTags('Validator')
@Controller('validators')
export class VerifyClaimController {
    constructor(private readonly verifyClaimService: VerifyClaimService) {}

    /**
     * Analiza un texto libre, normaliza afirmaciones y las valida semánticamente.
     */
    @Post('analyze')
    @ApiOperation({ summary: 'Extrae afirmaciones desde texto libre' })
    @ApiResponse({
        status: 201,
        description: 'Afirmaciones validadas correctamente.',
    })
    async analyzeTextFromFreeInput(
        @Body() verifyClaimDto: VerifyClaimDto,
    ): Promise<DataResponse<AgentFact[]>> {
        const result = await this.verifyClaimService.analyze(verifyClaimDto);

        return {
            status: 'ok',
            message: 'Afirmaciones extraídas y validadas.',
            data: result,
        };
    }

    /**
     * Busca si ya existe un hallazgo equivalente a un claim dado.
     * Debe ir antes que findings/:id para evitar colisiones de ruta.
     */
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
    ): Promise<DataResponse<AgentFinding | null>> {
        const finding = await this.verifyClaimService.getFindingByClaim(text);

        return {
            status: 'ok',
            message: finding
                ? 'Hallazgo encontrado.'
                : 'No se encontró ningún hallazgo equivalente.',
            data: finding,
        };
    }

    /**
     * Recupera un hallazgo completo por su ID.
     */
    @Get('findings/:id')
    @ApiOperation({ summary: 'Obtiene un hallazgo completo por ID' })
    @ApiResponse({
        status: 200,
        description: 'Hallazgo recuperado correctamente.',
    })
    async getFinding(
        @Param('id') id: string,
    ): Promise<DataResponse<AgentFinding>> {
        const finding = await this.verifyClaimService.getFindingById(id);

        return {
            status: 'ok',
            message: 'Hallazgo recuperado.',
            data: finding,
        };
    }

    /**
     * Lista todos los hallazgos existentes (uso interno o de depuración).
     */
    @Get('findings')
    @ApiOperation({ summary: 'Lista todos los hallazgos (uso interno)' })
    async getAllFindings(): Promise<DataResponse<AgentFinding[]>> {
        const findings = await this.verifyClaimService.getAllFindings();

        return {
            status: 'ok',
            message: 'Lista de hallazgos obtenida.',
            data: findings,
        };
    }

    /**
     * Recupera un fact específico por su ID.
     */
    @Get('facts/:id')
    @ApiOperation({ summary: 'Recupera un fact verificado por ID' })
    @ApiResponse({
        status: 200,
        description: 'Fact recuperado correctamente.',
    })
    async getFactById(
        @Param('id') id: string,
    ): Promise<DataResponse<AgentFact>> {
        const fact = await this.verifyClaimService.getFactById(id);

        return {
            status: 'ok',
            message: 'Fact recuperado.',
            data: fact,
        };
    }
}
