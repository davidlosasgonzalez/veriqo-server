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
 * Contiene el texto del claim a validar y una opción para esperar el resultado factual del agente.
 */
export class VerifyClaimDto {
    /**
     * Texto de entrada que puede contener una o varias afirmaciones.
     * El texto debe ser una cadena no vacía y no superar la longitud máxima permitida.
     */
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

    /**
     * Indica si debe esperar el resultado factual del agente.
     * Este valor es opcional y por defecto es false.
     */
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
