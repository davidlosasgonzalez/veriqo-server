import { FactDto } from '../dto/fact.dto';

import { mapToReasoningDto } from './reasoning.mapper';
import { mapToVerificationDto } from './verification.mapper';

import { Fact } from '@/shared/domain/entities/fact';

export function mapToFactDto(fact: Fact): FactDto {
    const dto = new FactDto();

    dto.id = fact.getId();
    dto.status = fact.getStatus();
    dto.category = fact.getCategory();
    dto.createdAt = fact.getCreatedAt();
    dto.updatedAt = fact.getUpdatedAt();

    dto.reasoning = fact.getReasonings()[0]
        ? mapToReasoningDto(fact.getReasonings()[0])
        : undefined;

    dto.verification = fact.getVerifications()[0]
        ? mapToVerificationDto(fact.getVerifications()[0])
        : undefined;

    return dto;
}
