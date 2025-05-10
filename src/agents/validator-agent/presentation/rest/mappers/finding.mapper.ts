import { FindingSearchContextDto } from '../dto/finding-search-context.dto';
import { FindingDto } from '../dto/finding.dto';

import { Finding } from '@/agents/validator-agent/domain/entities/finding';
import { FindingSearchContext } from '@/agents/validator-agent/domain/entities/finding-search-context';
import { Fact } from '@/shared/domain/entities/fact';
import { FactDto } from '@/shared/presentation/dto/fact.dto';

function mapToFactDto(fact: Fact): FactDto {
    return {
        id: fact.getId(),
        status: fact.getStatus(),
        category: fact.getCategory(),
        createdAt: fact.getCreatedAt(),
        updatedAt: fact.getUpdatedAt(),
    };
}

function mapToSearchContextDto(
    context: FindingSearchContext,
): FindingSearchContextDto {
    return {
        id: context.getId(),
        createdAt: context.getCreatedAt(),
        updatedAt: context.getUpdatedAt(),
        searchQuery: context.getSearchQuery(),
        siteSuggestions: context.getSiteSuggestions(),
    };
}

export function mapToFindingDto(finding: Finding): FindingDto {
    const context = finding.getSearchContext();

    return {
        id: finding.getId(),
        claim: finding.getClaim().getValue(),
        needsFactCheckReason: finding.getNeedsFactCheckReason(),
        fact: mapToFactDto(finding.getFact()),
        searchContext: context ? mapToSearchContextDto(context) : null,
        createdAt: finding.getCreatedAt(),
        updatedAt: finding.getUpdatedAt(),
    };
}
