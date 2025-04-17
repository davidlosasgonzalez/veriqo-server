/**
 * Payload del evento `factual_check_required`.
 * Contiene los datos necesarios para solicitar una verificación factual a otro agente.
 */
export type FactualCheckRequiredEventPayload = {
    /** Afirmación original a validar */
    claim: string;

    /** Contexto adicional (si aplica), como fuente, categoría, etc. */
    context?: string;

    /** ID del hallazgo relacionado que originó el evento */
    findingId?: string;

    /** Palabras clave extraídas del claim */
    keywords?: string[];

    /** Lista de sinónimos para enriquecer la búsqueda */
    synonyms?: string[];

    /** Query generada para búsqueda factual */
    searchQuery?: string;
};
