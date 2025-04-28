/**
 * Contiene información auxiliar para mejorar la búsqueda o comparación de un claim.
 */
/**
 * Contiene información auxiliar para mejorar la búsqueda o comparación de un claim.
 */
export class AgentFindingSearchContext {
    /* Identificador único del contexto. */
    id!: string;

    /* Identificador del hallazgo asociado. */
    findingId!: string;

    /* Palabras clave relacionadas. */
    keywords!: string[];

    /* Sinónimos relacionados (opcional). */
    synonyms?: Record<string, string[]> | null;

    /* Consulta estructurada de búsqueda. */
    searchQuery!: Record<string, string>;

    /* Sitios sugeridos para enfocar la búsqueda (opcional). */
    siteSuggestions?: string[] | null;

    /* Resultados de búsqueda estructurados (opcional). */
    searchResults?: Record<string, any>[] | null;

    /* Fecha de creación. */
    createdAt!: Date;

    /* Fecha de actualización. */
    updatedAt!: Date;
}
