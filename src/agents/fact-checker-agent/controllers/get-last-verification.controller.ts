import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetLastVerificationService } from '../services';
import { ExtendedFact } from '@/shared/types/extended-fact.type';

/**
 * Controlador para obtener la última verificación factual registrada.
 */
@ApiTags('Facts')
@Controller('facts')
export class GetLastVerificationController {
    constructor(
        private readonly getLastResultService: GetLastVerificationService,
    ) {}

    /**
     * Recupera la última verificación factual almacenada en base de datos.
     * @returns Verificación más reciente si existe.
     */
    @Get('verifications/last')
    @ApiOperation({
        summary: 'Recupera la última verificación factual registrada.',
    })
    @ApiResponse({
        status: 200,
        description: 'Verificación más reciente encontrada',
        schema: {
            example: {
                status: 'ok',
                message: 'Última verificación recuperada.',
                data: {
                    id: 'uuid',
                    claim: 'La velocidad de la luz depende del observador',
                    normalizedClaim: 'velocidad luz depende observador',
                    status: 'false',
                    reasoning:
                        'La afirmación contradice la relatividad especial...',
                    sources_retrieved: [
                        'https://es.wikipedia.org/wiki/Velocidad_de_la_luz',
                    ],
                    sources_used: [
                        'https://es.wikipedia.org/wiki/Velocidad_de_la_luz',
                    ],
                    createdAt: '2025-04-17T01:23:45.000Z',
                    updatedAt: '2025-04-17T01:23:45.000Z',
                },
            },
        },
    })
    async execute(): Promise<{
        status: string;
        message: string;
        data: ExtendedFact | null;
    }> {
        const result = await this.getLastResultService.execute();

        return {
            status: 'ok',
            message: result
                ? 'Última verificación recuperada.'
                : 'No hay verificaciones aún.',
            data: result,
        };
    }
}
