import { mapToReasoningDto } from './reasoning.mapper';

import { VerificationDto } from '@/agents/fact-checker/presentation/rest/dto/verification.dto';
import { Verification } from '@/shared/domain/entities/verification';

export function mapToVerificationDto(
    verification: Verification,
): VerificationDto {
    const reasoning = verification.getReasoning();

    return {
        id: verification.getId(),
        engineUsed: verification.getEngineUsed(),
        confidence: verification.getConfidence(),
        sourcesRetrieved: verification.getSourcesRetrieved(),
        sourcesUsed: verification.getSourcesUsed(),
        isOutdated: verification.getIsOutdated(),
        createdAt: verification.getCreatedAt(),
        updatedAt: verification.getUpdatedAt(),
        ...(reasoning && { reasoning: mapToReasoningDto(reasoning) }),
    };
}
