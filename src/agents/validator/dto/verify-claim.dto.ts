import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsBoolean,
    MaxLength,
} from 'class-validator';
import { env } from '@/config/env/env.config';

/**
 * DTO de entrada para analizar una afirmación y validarla.
 */
export class VerifyClaimDto {
    @ApiProperty({
        description:
            'Texto de entrada que puede contener una o varias afirmaciones',
        maxLength: env.VALIDATOR_MAX_INPUT_CHARS,
    })
    @Expose()
    @IsString()
    @MaxLength(env.VALIDATOR_MAX_INPUT_CHARS)
    @IsNotEmpty()
    claim: string;

    @ApiPropertyOptional({
        description:
            'Indica si debe esperar el resultado factual del agente (si aplica)',
        default: false,
    })
    @Expose()
    @IsOptional()
    @IsBoolean()
    waitForFact?: boolean;
}
