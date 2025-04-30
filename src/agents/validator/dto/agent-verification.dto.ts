import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { AgentReasoningDto } from './agent-reasoning.dto';

/**
 * DTO de salida que representa una verificación factual realizada por el agente FactChecker.
 */
@Exclude()
export class AgentVerificationDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty({ nullable: true })
    @Expose()
    engineUsed: string | null;

    @ApiProperty({ nullable: true })
    @Expose()
    confidence: number | null;

    @ApiProperty({ type: [String] })
    @Expose()
    sourcesRetrieved: string[];

    @ApiProperty({ type: [String] })
    @Expose()
    sourcesUsed: string[];

    @ApiProperty()
    @Expose()
    isOutdated: boolean;

    @Expose()
    @Type(() => AgentReasoningDto)
    reasoning: AgentReasoningDto;

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty()
    @Expose()
    updatedAt: Date;
}
