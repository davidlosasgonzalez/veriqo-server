import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VerifyFactDto } from './dto/verify-fact.dto';
import { FactCheckerAgentService } from './fact-checker-agent.service';
import { AgentVerification } from '@/domain/entities/agent-verification.entity';
import { DataResponse } from '@/shared/types/http-response.type';

@ApiTags('Fact Checker')
@Controller('facts')
export class FactCheckerAgentController {
    constructor(
        private readonly factCheckerAgentService: FactCheckerAgentService,
    ) {}

    /**
     * Verifica una afirmación utilizando búsqueda externa y modelo LLM.
     */
    @Post('verify')
    @ApiOperation({
        summary: 'Verifica una afirmación usando fuentes externas',
    })
    @ApiResponse({
        status: 201,
        description: 'Verificación factual creada.',
    })
    async verifyFact(
        @Body() verifyFactDto: VerifyFactDto,
    ): Promise<DataResponse<AgentVerification>> {
        const verification = await this.factCheckerAgentService.verifyFact(
            null,
            verifyFactDto.claim,
        );

        return {
            status: 'ok',
            message: 'Verificación factual realizada.',
            data: verification,
        };
    }

    /**
     * Recupera una verificación por su ID.
     */
    @Get('verifications/:id')
    @ApiOperation({ summary: 'Obtiene una verificación por ID' })
    @ApiResponse({
        status: 200,
        description: 'Verificación encontrada.',
    })
    async getVerificationById(
        @Param('id') id: string,
    ): Promise<DataResponse<AgentVerification>> {
        const verification =
            await this.factCheckerAgentService.getVerificationById(id);

        if (!verification) {
            throw new NotFoundException(
                'No se encontró la verificación solicitada.',
            );
        }

        return {
            status: 'ok',
            message: 'Verificación recuperada.',
            data: verification,
        };
    }
}
