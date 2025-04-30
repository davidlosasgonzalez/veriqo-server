import { Injectable } from '@nestjs/common';
import { AgentFactRepository } from '@/infrastructure/database/typeorm/repositories/agent-fact.repository';
import { AgentFindingRepository } from '@/infrastructure/database/typeorm/repositories/agent-finding.repository';
import { AgentLogService } from '@/shared/llm/services/agent-log.service';
import { AgentPromptService } from '@/shared/llm/services/agent-prompt.service';

/**
 * Servicio Core que ofrece acceso a logs, prompts y métricas del sistema.
 */
@Injectable()
export class CoreService {
    constructor(
        private readonly promptService: AgentPromptService,
        private readonly agentFindingRepository: AgentFindingRepository,
        private readonly agentFactRepository: AgentFactRepository,
        private readonly agentLogService: AgentLogService,
    ) {}

    /**
     * Recupera todos los logs registrados (no implementado aún).
     */
    async getLogs(): Promise<any[]> {
        return this.agentLogService.findAll();
    }

    /**
     * Recupera todos los prompts configurados.
     */
    async getPrompts(): Promise<any[]> {
        return this.promptService.findAll();
    }

    /**
     * Devuelve métricas globales de verificación factual.
     */
    async getStats(): Promise<any> {
        const findings = await this.agentFindingRepository.findAll();
        const facts = await this.agentFactRepository.findAll();
        const totalFindings = findings.length;
        const verifiedClaims = facts.filter(
            (fact) => fact.status === 'validated',
        ).length;
        const needsFactCheck = findings.filter(
            (fact) => fact.needsFactCheckReason !== null,
        ).length;
        const pending = findings.filter(
            (fact) => fact.fact.status === 'fact_checking',
        ).length;
        const factualCoverage =
            totalFindings > 0
                ? ((verifiedClaims / totalFindings) * 100).toFixed(2) + '%'
                : '0%';

        return {
            totalFindings,
            needsFactCheck,
            verifiedClaims,
            pending,
            factualCoverage,
            byCategory: this.buildCategoryStats(facts),
        };
    }

    /**
     * Devuelve métricas técnicas del servidor.
     */
    async getMetrics(): Promise<any> {
        const memory = process.memoryUsage();

        return {
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            memoryUsage: {
                rss: memory.rss,
                heapTotal: memory.heapTotal,
                heapUsed: memory.heapUsed,
                external: memory.external,
                arrayBuffers: memory.arrayBuffers,
            },
            env: process.env.NODE_ENV || 'development',
        };
    }

    private buildCategoryStats(facts: any[]): Record<string, number> {
        const stats: Record<string, number> = {};

        for (const fact of facts) {
            const category = fact.category || 'other';

            stats[category] = (stats[category] ?? 0) + 1;
        }

        return stats;
    }
}
