import { Inject, Injectable } from '@nestjs/common';

import { FindingRepository } from '@/agents/validator-agent/infrastructure/repositories/finding.repository';
import { Fact } from '@/shared/domain/entities/fact';
import { FactRepository } from '@/shared/infrastructure/repositories/fact.repository';
import { VerificationStatsDto } from '@/shared/presentation/dto/verification-stats.dto';

@Injectable()
export class GetVerificationStatsUseCase {
    constructor(
        @Inject(FindingRepository)
        private readonly findingRepository: FindingRepository,

        @Inject(FactRepository)
        private readonly factRepository: FactRepository,
    ) {}

    async execute(): Promise<VerificationStatsDto> {
        const findings = await this.findingRepository.findAll();
        const facts = await this.factRepository.findAll();

        const totalFindings = findings.length;
        const verifiedClaims = facts.filter(
            (fact) => fact.getStatus() === 'validated',
        ).length;
        const needsFactCheck = findings.filter(
            (f) => f.getNeedsFactCheckReason() !== null,
        ).length;
        const pending = findings.filter(
            (f) => f.getFact().getStatus() === 'fact_checking',
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

    private buildCategoryStats(facts: Fact[]): Record<string, number> {
        const stats: Record<string, number> = {};

        for (const fact of facts) {
            const category = fact.getCategory() ?? 'other';
            stats[category] = (stats[category] ?? 0) + 1;
        }

        return stats;
    }
}
