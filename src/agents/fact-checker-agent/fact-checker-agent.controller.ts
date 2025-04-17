import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiParam,
    ApiBody,
    ApiOkResponse,
} from '@nestjs/swagger';
import { ExecuteFactCheckerDto } from './dto/execute-fact-checker.dto';
import { FactCheckerAgentService } from './fact-checker-agent.service';
import { AgentFactService } from '@/shared/facts/services/agent-fact.service';
import { AgentVerificationService } from '@/shared/facts/services/agent-verification.service';
import { ExtendedFact } from '@/shared/types/extended-fact.type';
import { DataResponse } from '@/shared/types/http-response.type';

@ApiTags('Fact Checker Agent')
@Controller('agents/fact-checker')
export class FactCheckerAgentController {
    constructor(
        private readonly factCheckerService: FactCheckerAgentService,
        private readonly factService: AgentFactService,
        private readonly verificationService: AgentVerificationService,
    ) {}

    /**
     * Verifica una afirmación concreta usando el agente fact-checker.
     */
    @Post()
    @ApiOperation({ summary: 'Verifica una afirmación factual.' })
    @ApiBody({ type: ExecuteFactCheckerDto })
    @ApiOkResponse({ description: 'Resultado de la verificación factual.' })
    async verifyClaim(
        @Body() executeFactCheckerDto: ExecuteFactCheckerDto,
    ): Promise<DataResponse<any>> {
        if (!executeFactCheckerDto.claim?.trim()) {
            return {
                status: 'error',
                message: 'El campo claim es obligatorio.',
                data: null,
            };
        }

        const result = await this.factCheckerService.verifyClaim({
            claim: executeFactCheckerDto.claim,
            context: executeFactCheckerDto.context ?? 'manual',
        });

        return {
            status: 'ok',
            message: 'Verificación completada.',
            data: result,
        };
    }

    /**
     * Devuelve la última verificación realizada por el agente.
     */
    @Get('last')
    @ApiOperation({ summary: 'Última verificación factual realizada.' })
    @ApiOkResponse({ description: 'Último resultado de verificación.' })
    async getLastVerification(): Promise<DataResponse<any>> {
        const result = this.factCheckerService.getLastResult();
        return {
            status: 'ok',
            message: 'Última verificación obtenida.',
            data: result,
        };
    }

    /**
     * Devuelve una verificación específica a partir de un claim.
     */
    @Get('facts/:claim')
    @ApiOperation({ summary: 'Busca una verificación previa por claim.' })
    @ApiParam({
        name: 'claim',
        example: 'La velocidad de la luz depende del observador',
    })
    @ApiOkResponse({ type: ExtendedFact })
    async getFactByClaim(
        @Param('claim') claim: string,
    ): Promise<DataResponse<ExtendedFact | null>> {
        const fact = await this.factService.findByClaim(claim);
        const verification = await this.verificationService.findByClaim(claim);

        const extended: ExtendedFact | null = fact
            ? {
                  ...(() => {
                      const { embedding, ...safeFact } = fact;
                      return safeFact;
                  })(),
                  reasoning: verification?.reasoning ?? '[Sin explicación]',
                  sources_retrieved: verification?.sourcesRetrieved ?? [],
                  sources_used: verification?.sourcesUsed ?? [],
                  sources: fact.sources ?? [],
                  createdAt: fact.createdAt.toISOString(),
                  updatedAt: fact.updatedAt.toISOString(),
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

    /**
     * Devuelve todo el historial de verificaciones realizadas.
     */
    @Get('history')
    @ApiOperation({ summary: 'Historial de verificaciones previas.' })
    @ApiOkResponse({ type: [ExtendedFact] })
    async getFactHistory(): Promise<DataResponse<ExtendedFact[]>> {
        const facts = await this.factService.findAll();

        const extended: ExtendedFact[] = await Promise.all(
            facts.map(async (fact) => {
                const verification = await this.verificationService.findByClaim(
                    fact.claim,
                );

                const { embedding, ...safeFact } = fact;

                return {
                    ...safeFact,
                    reasoning: verification?.reasoning ?? '[Sin explicación]',
                    sources_retrieved: verification?.sourcesRetrieved ?? [],
                    sources_used: verification?.sourcesUsed ?? [],
                    sources: fact.sources ?? [],
                    createdAt: fact.createdAt.toISOString(),
                    updatedAt: fact.updatedAt.toISOString(),
                };
            }),
        );

        return {
            status: 'ok',
            message: 'Historial recuperado correctamente.',
            data: extended,
        };
    }

    /**
     * Devuelve una verificación específica a partir de su ID.
     */
    @Get('verifications/:verificationId')
    @ApiOperation({ summary: 'Busca una verificación por ID único.' })
    @ApiParam({ name: 'verificationId', example: 'uuid-verificacion' })
    @ApiOkResponse({ description: 'Verificación encontrada.' })
    async getVerificationById(
        @Param('verificationId') verificationId: string,
    ): Promise<DataResponse<any>> {
        const cleanedId = verificationId.trim().toLowerCase();
        const verification = await this.verificationService.findById(cleanedId);

        if (!verification) {
            return {
                status: 'error',
                message: 'No se encontró la verificación con ese ID.',
                data: null,
            };
        }

        return {
            status: 'ok',
            message: 'Verificación encontrada.',
            data: verification,
        };
    }
}
