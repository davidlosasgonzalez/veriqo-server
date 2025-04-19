import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsString, MinLength, IsOptional, IsUUID } from 'class-validator';

/**
 * DTO para iniciar una verificación factual con el FactCheckerAgent.
 */
export class ExecuteFactCheckerDto {
    /**
     * Afirmación concreta que se desea verificar de forma factual.
     */
    @ApiProperty({
        example: 'Pedro Gómez fue astronauta de la NASA.',
        description:
            'Afirmación concreta que se desea verificar de forma factual.',
    })
    @IsString()
    @MinLength(10)
    readonly claim: string;

    /**
     * Contexto general que ayuda a comprender mejor la afirmación.
     */
    @ApiPropertyOptional({
        example: 'Texto original completo donde se encontró la afirmación.',
        description:
            'Contexto general que ayuda a comprender mejor la afirmación.',
    })
    @IsOptional()
    @IsString()
    readonly context?: string;

    /**
     * Consulta optimizada para Brave o Google.
     * Si no se proporciona, se usará el claim.
     */
    @ApiPropertyOptional({
        example: '"Pedro Gómez" astronauta NASA',
        description:
            'Consulta optimizada para Brave o Google. Si no se proporciona, se usará el claim.',
    })
    @IsOptional()
    @IsString()
    readonly searchQuery?: string;

    /**
     * ID del hallazgo original del ValidatorAgent, si procede.
     */
    @ApiPropertyOptional({
        example: '1e7d73f0-d9f3-4c9a-8d4f-1c2c5b7c30e0',
        description: 'ID del hallazgo original del ValidatorAgent, si procede.',
    })
    @IsOptional()
    @IsUUID()
    readonly findingId?: string;
}
