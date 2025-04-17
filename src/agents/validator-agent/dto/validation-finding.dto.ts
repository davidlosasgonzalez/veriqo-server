import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AgentFindingCategory } from '@/core/database/entities/agent-finding.entity';

/**
 * DTO que representa un hallazgo generado por el ValidatorAgent.
 */
export class ValidationFindingDto {
    constructor(partial?: Partial<ValidationFindingDto>) {
        Object.assign(this, partial);
    }

    /** UUID del hallazgo */
    @ApiProperty()
    id: string;

    /** Afirmación detectada por el ValidatorAgent */
    @ApiProperty()
    claim: string;

    /** Categoría del error o contradicción detectada */
    @ApiProperty({ enum: AgentFindingCategory })
    category: AgentFindingCategory;

    /** Resumen breve del hallazgo */
    @ApiProperty()
    summary: string;

    /** Explicación detallada del hallazgo */
    @ApiProperty()
    explanation: string;

    /** Sugerencia de mejora o corrección del texto */
    @ApiProperty()
    suggestion: string;

    /** Palabras clave relevantes extraídas del claim */
    @ApiPropertyOptional({ type: [String] })
    keywords?: string[];

    /** Mapa de sinónimos encontrados */
    @ApiPropertyOptional({
        type: 'object',
        additionalProperties: {
            type: 'array',
            items: { type: 'string' },
        },
    })
    synonyms?: Record<string, string[]>;

    /** Entidades nombradas extraídas */
    @ApiPropertyOptional({ type: [String] })
    namedEntities?: string[];

    /** Ubicaciones mencionadas */
    @ApiPropertyOptional({ type: [String] })
    locations?: string[];

    /** Consulta de búsqueda generada automáticamente */
    @ApiPropertyOptional()
    searchQuery?: string;

    /** Sitios sugeridos como fuentes potenciales */
    @ApiPropertyOptional({ type: [String] })
    siteSuggestions?: string[];

    /** Estado de veracidad del fact relacionado (si existe) */
    @ApiPropertyOptional({
        description: 'Estado del fact relacionado',
        example: 'true',
    })
    factStatus?: string;

    /** Fecha en la que se realizó la verificación factual */
    @ApiPropertyOptional({
        description: 'Fecha de verificación factual',
        example: '2025-04-10T14:23:00.000Z',
    })
    factCheckedAt?: string;

    /** Fuentes utilizadas durante la verificación factual */
    @ApiPropertyOptional({
        type: [String],
        description: 'Fuentes utilizadas en la verificación factual',
    })
    factSourcesUsed?: string[];

    /** Indica si el resultado factual fue concluyente */
    @ApiPropertyOptional({
        description:
            'Indica si el resultado del fact fue concluyente (true/false) o no (unknown)',
        example: true,
    })
    factIsConclusive?: boolean;

    /** Indica si esta afirmación requiere verificación factual adicional */
    @ApiProperty()
    needsFactCheck: boolean;

    /** Motivo por el que se requiere (o no) verificación factual */
    @ApiPropertyOptional()
    needsFactCheckReason?: string;

    /** ID del fact relacionado (si existe una verificación previa) */
    @ApiPropertyOptional({
        description:
            'ID del AgentFact relacionado si ya existía una verificación previa equivalente.',
        example: 'a6f0b26e-9f8f-487d-b0f0-d65b0c4db9aa',
    })
    relatedFactId?: string;
}
