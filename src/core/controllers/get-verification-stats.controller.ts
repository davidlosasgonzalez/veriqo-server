import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AgentFindingService } from '@/shared/facts/services/agent-finding.service';

/**
 * Controlador que expone métricas globales de verificación factual.
 */
@ApiTags('Core')
@Controller('core')
export class GetVerificationStatsController {
    constructor(private readonly agentFindingService: AgentFindingService) {}

    /**
     * Devuelve métricas globales agregadas del sistema de validación factual.
     */
    @Get('stats')
    @ApiOperation({
        summary: 'Devuelve métricas globales de verificación factual',
    })
    async execute() {
        const allFindings = await this.agentFindingService.findAll();

        const total = allFindings.length;
        const needsFactCheck = allFindings.filter(
            (f) => f.needsFactCheck,
        ).length;
        const verifiedClaims = total - needsFactCheck;
        const pending = allFindings.filter(
            (f) => f.needsFactCheck && !f.relatedFactId,
        ).length;

        const factualCoverage = total
            ? `${((verifiedClaims / total) * 100).toFixed(2)}%`
            : '0%';

        const byCategory = allFindings.reduce<Record<string, number>>(
            (acc, f) => {
                const key = f.category;
                acc[key] = (acc[key] ?? 0) + 1;
                return acc;
            },
            {},
        );

        return {
            status: 'ok',
            message: 'Métricas globales de verificación factual.',
            data: {
                totalFindings: total,
                needsFactCheck,
                verifiedClaims,
                pending,
                factualCoverage,
                byCategory,
            },
        };
    }
}
