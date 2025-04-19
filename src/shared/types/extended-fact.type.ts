import { ApiProperty } from '@nestjs/swagger';
import { VerificationVerdict } from './verification-verdict.type';

/**
 * Tipo extendido que representa un AgentFact junto con información de verificación factual.
 */
export class ExtendedFact {
    @ApiProperty({ example: 'uuid-del-fact' })
    id: string;

    @ApiProperty({ example: 'La velocidad de la luz depende del observador' })
    claim: string;

    @ApiProperty({ example: 'velocidad luz depende observador' })
    normalizedClaim?: string;

    @ApiProperty({
        example: 'false',
        enum: ['true', 'false', 'possibly_true', 'unknown'],
    })
    status: VerificationVerdict;

    @ApiProperty({
        description: 'Explicación generada por el agente',
        nullable: true,
    })
    reasoning: string | null;

    @ApiProperty({ type: [String] })
    sources_retrieved: string[];

    @ApiProperty({ type: [String] })
    sources_used: string[];

    @ApiProperty({ example: '2025-04-17T01:23:45.000Z' })
    createdAt: string;

    @ApiProperty({ example: '2025-04-17T01:23:45.000Z' })
    updatedAt: string;
}
