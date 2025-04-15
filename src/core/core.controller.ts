import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AgentFindingCategory } from '@/database/entities/agent-findings.entity';
import { AgentFindingService } from '@/shared/facts/agent-finding.service';
import { AgentVerificationService } from '@/shared/facts/agent-verification.service';
import { AgentLoggerService } from '@/shared/logger/agent-logger.service';
import { DataResponse } from '@/shared/types/base-response.type';

@ApiTags('System')
@Controller('system')
export class CoreController {
    constructor(
        private readonly loggerService: AgentLoggerService,
        private readonly verificationService: AgentVerificationService,
        private readonly findingService: AgentFindingService,
    ) {}

    @Get('log-summary')
    @ApiOperation({
        summary: 'Resumen del uso de motores de búsqueda y resultados',
    })
    async getLogSummary(): Promise<DataResponse<any>> {
        const allLogs = await this.loggerService.getAllLogs();

        const engines: Record<string, number> = {};
        const resultSums: Record<string, number> = {};

        for (const log of allLogs) {
            const engine = log.engineUsed ?? 'unknown';
            engines[engine] = (engines[engine] ?? 0) + 1;
            if (log.totalResults !== undefined) {
                resultSums[engine] =
                    (resultSums[engine] ?? 0) + log.totalResults;
            }
        }

        const averageResults: Record<string, number> = {};
        for (const engine of Object.keys(engines)) {
            const total = engines[engine];
            const totalFound = resultSums[engine] ?? 0;
            averageResults[engine] = Number((totalFound / total).toFixed(2));
        }

        return {
            status: 'ok',
            message: 'Resumen de logs.',
            data: {
                totalLogs: allLogs.length,
                engines,
                averageResults,
            },
        };
    }

    @Get('metrics')
    @ApiOperation({
        summary: 'Métricas de cobertura factual y distribución de findings',
    })
    @ApiResponse({
        status: 200,
        description: 'Métricas obtenidas correctamente.',
    })
    async getMetrics(): Promise<DataResponse<any>> {
        const findings = await this.findingService.getAllFindings();
        const verifications =
            await this.verificationService.getAllVerifications();

        const totalFindings = findings.length;
        const needsFactCheck = findings.filter((f) => f.needsFactCheck).length;
        const verifiedClaims = new Set(verifications.map((v) => v.claim)).size;
        const pending = needsFactCheck - verifiedClaims;
        const coverage =
            needsFactCheck === 0 ? 1 : verifiedClaims / needsFactCheck;

        const byCategory: Record<AgentFindingCategory, number> = {
            factual_error: 0,
            contradiction: 0,
            ambiguity: 0,
            reasoning: 0,
            style: 0,
            other: 0,
        };

        for (const f of findings) {
            byCategory[f.category]++;
        }

        return {
            status: 'ok',
            message: 'Métricas globales de verificación factual.',
            data: {
                totalFindings,
                needsFactCheck,
                verifiedClaims,
                pending,
                factualCoverage: `${(coverage * 100).toFixed(2)}%`,
                byCategory,
            },
        };
    }
}
