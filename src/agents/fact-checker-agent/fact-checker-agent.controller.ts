import { Controller, Get, Post, Query, Param } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
} from '@nestjs/swagger';
import { FactCheckerAgentService } from './fact-checker-agent.service';
import { AgentFact } from '@/database/entities/agent-facts.entity';
import { AgentFactService } from '@/shared/facts/agent-fact.service';
import { AgentVerificationService } from '@/shared/facts/agent-verification.service';
import { DataResponse } from '@/shared/types/base-response.type';

type ExtendedFact = AgentFact & {
    reasoning: string;
    sources_retrieved: string[];
    sources_used: string[];
};

@ApiTags('Fact Checker Agent')
@Controller('agents/fact-checker')
export class FactCheckerAgentController {
    constructor(
        private readonly factCheckerService: FactCheckerAgentService,
        private readonly factService: AgentFactService,
        private readonly verificationService: AgentVerificationService,
    ) {}

    @Get('last')
    @ApiOperation({
        summary: 'Devuelve la última verificación factual realizada',
    })
    async getLastVerification(): Promise<DataResponse<any>> {
        const result = this.factCheckerService.getLastResult();
        return {
            status: 'ok',
            message: 'Última verificación obtenida.',
            data: result,
        };
    }

    @Get('facts/:claim')
    @ApiOperation({
        summary: 'Devuelve una verificación específica si ya fue realizada',
    })
    @ApiParam({
        name: 'claim',
        example: 'La velocidad de la luz depende del observador',
    })
    async getFactByClaim(
        @Param('claim') claim: string,
    ): Promise<DataResponse<ExtendedFact | null>> {
        const fact = await this.factService.getFactByClaim(claim);
        const verification =
            await this.verificationService.getVerificationByClaim(claim);

        const extended: ExtendedFact | null = fact
            ? {
                  ...fact,
                  reasoning: verification?.reasoning ?? '[Sin explicación]',
                  sources_retrieved: verification?.sourcesRetrieved ?? [],
                  sources_used: verification?.sourcesUsed ?? [],
              }
            : null;

        return {
            status: 'ok',
            message: fact
                ? 'Verificación encontrada.'
                : 'No se encontró verificación previa.',
            data: extended,
        };
    }

    @Get('history')
    @ApiOperation({
        summary: 'Devuelve el historial de verificaciones realizadas',
    })
    async getHistory(): Promise<DataResponse<ExtendedFact[]>> {
        const facts = await this.factService.getAllFacts();

        const extended: ExtendedFact[] = await Promise.all(
            facts.map(async (fact) => {
                const verification =
                    await this.verificationService.getVerificationByClaim(
                        fact.claim,
                    );
                return {
                    ...fact,
                    reasoning: verification?.reasoning ?? '[Sin explicación]',
                    sources_retrieved: verification?.sourcesRetrieved ?? [],
                    sources_used: verification?.sourcesUsed ?? [],
                };
            }),
        );

        return {
            status: 'ok',
            message: 'Historial recuperado correctamente.',
            data: extended,
        };
    }

    @Post('recheck')
    @ApiOperation({ summary: 'Re-verifica una afirmación específica' })
    @ApiQuery({ name: 'claim', example: 'La Tierra es plana', required: true })
    async refreshClaim(
        @Query('claim') claim: string,
    ): Promise<DataResponse<any>> {
        if (!claim || !claim.trim()) {
            return {
                status: 'error',
                message:
                    'Se requiere una afirmación (claim) para re-verificar.',
                data: null,
            };
        }

        const result = await this.factCheckerService.execute({
            claim,
            context: 'refresh_manual',
        });

        return {
            status: 'ok',
            message: 'Verificación forzada completada.',
            data: result,
        };
    }
}
