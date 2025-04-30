import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { AgentReasoningDto } from '@/agents/validator/dto/agent-reasoning.dto';
import { AgentVerificationDto } from '@/agents/validator/dto/agent-verification.dto';
import {
    AgentFactCategory,
    AgentFactStatus,
} from '@/shared/types/enums/agent-fact.types';

/**
 * DTO de salida que representa un hecho factual validado o verificado.
 */
@Exclude()
export class AgentFactDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiPropertyOptional({
        enum: ['validated', 'rejected', 'fact_checking', 'matched', 'error'],
    })
    @Expose()
    status?: AgentFactStatus | null;

    @ApiPropertyOptional({
        enum: [
            'factual',
            'logical',
            'semantic',
            'unsupported',
            'syntactic',
            'opinion',
            'irrelevant',
            'other',
        ],
    })
    @Expose()
    category: AgentFactCategory;

    @ApiPropertyOptional({ type: AgentVerificationDto })
    @Expose()
    @Type(() => AgentVerificationDto)
    verification?: AgentVerificationDto;

    @ApiPropertyOptional({ type: AgentReasoningDto })
    @Expose()
    @Type(() => AgentReasoningDto)
    reasoning?: AgentReasoningDto;

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty()
    @Expose()
    updatedAt: Date;
}
