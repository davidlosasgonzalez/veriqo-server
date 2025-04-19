import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AgentFactDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    claim: string;

    @ApiProperty()
    @Expose()
    normalizedClaim: string;

    @Expose()
    @ApiProperty({ enum: ['true', 'false', 'possibly_true', 'unknown'] })
    status: string;

    @ApiProperty({ type: [String] })
    @Expose()
    sourcesRetrieved: string[];

    @ApiProperty({ type: [String], nullable: true })
    @Expose()
    sourcesUsed: string[] | null;

    @ApiProperty({ nullable: true })
    @Expose()
    reasoning: string | null;

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty()
    @Expose()
    updatedAt: Date;

    @Exclude()
    embedding?: number[];
}
