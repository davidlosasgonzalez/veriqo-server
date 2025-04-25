import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
    AgentFactCategory,
    AgentFactStatus,
} from '@/shared/types/agent-fact.types';

/**
 * DTO de salida que representa un hecho factual validado o verificado.
 */
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
    category?: AgentFactCategory | null;

    @ApiPropertyOptional()
    @Expose()
    summary?: string | null;

    @ApiPropertyOptional()
    @Expose()
    reasoning?: string | null;

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty()
    @Expose()
    updatedAt: Date;
}
