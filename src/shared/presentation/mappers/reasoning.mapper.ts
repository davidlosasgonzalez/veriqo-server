import { Reasoning } from '@/shared/domain/entities/reasoning';
import { ReasoningDto } from '@/shared/presentation/dto/reasoning.dto';

export function mapToReasoningDto(reasoning: Reasoning): ReasoningDto {
    return {
        id: reasoning.getId(),
        summary: reasoning.getSummary().getValue(),
        content: reasoning.getContent().getValue(),
        createdAt: reasoning.getCreatedAt(),
        updatedAt: reasoning.getUpdatedAt(),
    };
}
