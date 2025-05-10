import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { ReasoningDto } from '@/shared/presentation/dto/reasoning.dto';

@Exclude()
export class VerificationDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty({ nullable: true })
    @Expose()
    engineUsed: string | null;

    @ApiProperty({ nullable: true })
    @Expose()
    confidence: number | null;

    @ApiProperty()
    @Expose()
    sourcesRetrieved: string[];

    @ApiProperty()
    @Expose()
    sourcesUsed: string[];

    @ApiProperty()
    @Expose()
    isOutdated: boolean;

    @ApiProperty({ required: false, type: () => ReasoningDto })
    @Expose()
    reasoning?: ReasoningDto;

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty()
    @Expose()
    updatedAt: Date;
}
