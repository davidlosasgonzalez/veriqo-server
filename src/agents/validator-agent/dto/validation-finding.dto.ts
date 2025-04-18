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

    /** Afirmación normalizada para comparación semántica */
    @ApiPropertyOptional()
    normalizedClaim?: string;

    /** Categoría del error o contradicción detectada */
    @ApiProperty({
        enum: AgentFindingCategory,
        enumName: 'AgentFindingCategory',
    })
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
        description: 'Mapa de sinónimos agrupados por término detectado.',
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
        description: 'Estado de veracidad determinado por el FactChecker',
        enum: ['true', 'false', 'possibly_true', 'unknown'],
        example: 'false',
    })
    factStatus?: string;

    /** Fecha en la que se realizó la verificación factual */
    @ApiPropertyOptional({
        description:
            'Fecha en la que se realizó la última verificación factual disponible.',
        example: '2025-04-10T14:23:00.000Z',
    })
    factCheckedAt?: string;

    /** Fuentes utilizadas durante la verificación factual */
    @ApiPropertyOptional({
        type: [String],
        description: 'Fuentes utilizadas durante la verificación factual.',
    })
    factSourcesUsed?: string[];

    /** Indica si el resultado factual fue concluyente */
    @ApiPropertyOptional({
        description:
            'Indica si el resultado del fact fue concluyente (true/false) o no (unknown).',
        example: true,
    })
    factIsConclusive?: boolean;

    /** Veredicto generado por el FactChecker */
    @ApiPropertyOptional({
        description: 'Veredicto emitido por el FactChecker.',
        example: 'cierto',
    })
    verdict?: string;

    /** Fuentes breves asociadas al claim */
    @ApiPropertyOptional({
        type: [String],
        description: 'Fuentes relacionadas directamente con el hallazgo.',
    })
    sources?: string[];

    /** Justificación textual del resultado devuelto por el agente */
    @ApiPropertyOptional({
        description:
            'Motivo o explicación técnica del estado actual del hallazgo',
        example: 'Verificación previa existente',
    })
    reason?: string;

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

    /** Fecha de creación del hallazgo */
    @ApiPropertyOptional({ description: 'Fecha de creación del hallazgo' })
    createdAt?: Date;

    /** Fecha de última actualización del hallazgo */
    @ApiPropertyOptional({
        description: 'Fecha de última actualización del hallazgo',
    })
    updatedAt?: Date;
}
