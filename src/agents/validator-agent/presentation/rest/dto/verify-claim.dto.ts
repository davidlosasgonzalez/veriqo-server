import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';

import { env } from '@/config/env/env.config';

export class VerifyClaimDto {
    @ApiProperty({
        description:
            'Texto de entrada que puede contener una o varias afirmaciones verificables.',
        maxLength: env.VALIDATOR_MAX_INPUT_CHARS,
    })
    @Expose()
    @IsString()

    // TODO: Estoy usando env.VALIDATOR_MAX_INPUT_CHARS en tiempo de ejecución, pero los decoradores como @MaxLength() son evaluados en tiempo de carga.
    @MaxLength(env.VALIDATOR_MAX_INPUT_CHARS)
    @IsNotEmpty()
    claim: string;

    // TODO: por implementar...
    @ApiPropertyOptional({
        description:
            'Indica si debe esperarse el resultado factual completo antes de responder.',
        default: false,
    })
    @Expose()
    @IsOptional()
    @IsBoolean()
    waitForFact?: boolean;
}
