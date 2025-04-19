import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsBoolean,
    IsOptional,
    IsString,
    MaxLength,
    Matches,
    MinLength,
} from 'class-validator';
import { env } from '@/config/env/env.config';

/**
 * DTO para ejecutar el análisis de texto por el ValidatorAgent.
 */
export class ExecuteValidatorDto {
    /**
     * Texto que deseas que el ValidatorAgent analice.
     */
    @ApiProperty({
        example: 'Pedro Gómez fue astronauta de la NASA.',
        description: 'Texto que deseas que el ValidatorAgent analice.',
        minLength: 5,
        maxLength: env.VALIDATOR_MAX_INPUT_CHARS,
    })
    @IsString()
    @MinLength(5)
    @MaxLength(env.VALIDATOR_MAX_INPUT_CHARS, {
        message: `El prompt no puede superar los ${env.VALIDATOR_MAX_INPUT_CHARS} caracteres.`,
    })
    @Matches(/\S/, {
        message: 'El prompt no puede estar vacío o solo contener espacios.',
    })
    prompt: string;

    /**
     * Si está activo, el ValidatorAgent esperará a que el FactCheckerAgent
     * complete la verificación antes de devolver la respuesta.
     */
    @ApiPropertyOptional({
        description:
            'Indica si se debe esperar una respuesta del FactCheckerAgent antes de devolver resultado.',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    waitForFact?: boolean;
}
