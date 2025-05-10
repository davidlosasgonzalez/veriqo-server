import { type FactCategory } from '../enums/fact-category.enum';
import { type FactStatus } from '../enums/fact-status.enum';

import { Reasoning } from './reasoning';
import { Verification } from './verification';

import { Finding } from '@/agents/validator-agent/domain/entities/finding';

export class Fact {
    constructor(
        private readonly id: string,
        private readonly status: FactStatus,
        private readonly category: FactCategory,
        private readonly createdAt: Date,
        private readonly updatedAt: Date,
        private readonly verifications: Verification[] = [],
        private readonly reasonings: Reasoning[] = [],
        private readonly findings: Finding[] = [],
    ) {
        if (!status) throw new Error('El status del AgentFact es obligatorio.');

        if (!category)
            throw new Error('La categoría del AgentFact es obligatoria.');
    }

    getId(): string {
        return this.id;
    }

    getStatus(): FactStatus {
        return this.status;
    }

    getCategory(): FactCategory {
        return this.category;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getUpdatedAt(): Date {
        return this.updatedAt;
    }

    getVerifications(): Verification[] {
        return this.verifications;
    }

    getReasonings(): Reasoning[] {
        return this.reasonings;
    }

    getFindings(): Finding[] {
        return this.findings;
    }
}
