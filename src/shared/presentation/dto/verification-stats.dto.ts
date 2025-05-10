import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class VerificationStatsDto {
    @ApiProperty()
    @Expose()
    totalFindings: number;

    @ApiProperty()
    @Expose()
    needsFactCheck: number;

    @ApiProperty()
    @Expose()
    verifiedClaims: number;

    @ApiProperty()
    @Expose()
    pending: number;

    @ApiProperty()
    @Expose()
    factualCoverage: string;

    @ApiProperty({ type: 'object', additionalProperties: { type: 'number' } })
    @Expose()
    byCategory: Record<string, number>;
}
