/**
 * Resultado crudo de búsqueda obtenido desde Brave, Google u otro motor.
 */
export interface RawSearchResult {
    url: string;
    title?: string;
    snippet?: string;
    domain?: string;
    publishedAt?: string | null;
}
