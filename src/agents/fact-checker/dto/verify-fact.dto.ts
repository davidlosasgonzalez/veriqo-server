import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { env } from '@/config/env/env.config';

/**
 * DTO para solicitar la verificación factual de un claim.
 */
export class VerifyFactDto {
    @ApiProperty({
        description: 'Texto de la afirmación a verificar',
        maxLength: env.VALIDATOR_MAX_INPUT_CHARS,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(env.VALIDATOR_MAX_INPUT_CHARS)
    claim: string;
}
