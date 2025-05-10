import { Fact } from '../../../../shared/domain/entities/fact';
import { ClaimText } from '../value-objects/claim-text.vo';

import { FindingSearchContext } from './finding-search-context';

export class Finding {
    constructor(
        private readonly id: string,
        private readonly claim: ClaimText,
        private readonly embedding: number[],
        private readonly createdAt: Date,
        private readonly updatedAt: Date,
        private readonly fact: Fact,
        private needsFactCheckReason?: string | null,
        private readonly searchContext?: FindingSearchContext | null,
    ) {
        if (embedding?.length === 0) {
            throw new Error(
                'El embedding del AgentFinding no puede estar vacío.',
            );
        }
    }

    getId(): string {
        return this.id;
    }

    getClaim(): ClaimText {
        return this.claim;
    }

    getEmbedding(): number[] {
        return this.embedding;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getUpdatedAt(): Date {
        return this.updatedAt;
    }

    getFact(): Fact {
        return this.fact;
    }

    getNeedsFactCheckReason(): string | null | undefined {
        return this.needsFactCheckReason;
    }

    getSearchContext(): FindingSearchContext | null | undefined {
        return this.searchContext;
    }

    setNeedsFactCheckReason(reason: string | null): void {
        this.needsFactCheckReason = reason;
    }
}
