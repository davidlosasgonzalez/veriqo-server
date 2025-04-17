import { AgentFindingCategory } from '@/core/database/entities/agent-finding.entity';

/**
 * Resultado de validación emitido por un agente (ValidatorAgent).
 * Describe el problema, su categoría, explicaciones y datos relacionados.
 */
export type ValidationFinding = {
    /** Identificador único del finding (UUID) */
    id: string;

    /** Claim original validado */
    claim: string;

    /** Categoría del problema detectado (ej. factual_error, contradiction...) */
    category: AgentFindingCategory;

    /** Descripción breve del hallazgo */
    summary: string;

    /** Explicación detallada del problema identificado */
    explanation: string;

    /** Sugerencia para corregir el claim */
    suggestion: string;

    /** Palabras clave extraídas del claim */
    keywords?: string[];

    /** Mapa de sinónimos detectados para keywords */
    synonyms?: Record<string, string[]>;

    /** Entidades nombradas encontradas (ej. personas, organizaciones) */
    namedEntities?: string[];

    /** Ubicaciones geográficas detectadas */
    locations?: string[];

    /** Query de búsqueda generada para este claim */
    searchQuery?: string;

    /** Sugerencias de dominios relevantes para buscar información */
    siteSuggestions?: string[];

    /** Indica si el finding requiere verificación factual */
    needsFactCheck: boolean;

    /** Motivo por el cual se requiere verificación factual */
    needsFactCheckReason?: string;

    /** ID de un fact verificado relacionado */
    relatedFactId?: string;

    /** Estado factual del claim relacionado (true, false, possibly_true...) */
    factStatus?: string;

    /** Fecha de última verificación factual */
    factCheckedAt?: string;

    /** Fuentes utilizadas para determinar el estado factual */
    factSourcesUsed?: string[];

    /** Si el estado factual es concluyente o no */
    factIsConclusive?: boolean;
};
