/**
 * Construye una estrategia de consulta a partir del contexto de búsqueda disponible.
 *
 * Prioriza las opciones en el siguiente orden:
 * 1. `searchQuery.es` si está disponible (español).
 * 2. `searchQuery.en` si está disponible (inglés).
 * 3. El claim original como última opción.
 *
 * Si existe una `searchQuery.en` además de `searchQuery.es`, se proporciona como opción de fallback.
 *
 * @param claim - Claim original en texto libre.
 * @param searchQuery - Opcional. Diccionario con queries preprocesadas en diferentes idiomas (es, en).
 * @returns Objeto con:
 * - `finalQuery`: Query principal a usar.
 * - `fallbackQuery`: (opcional) Query alternativa en otro idioma, si existe.
 */
export function buildQuery(
    claim: string,
    searchQuery?: Record<string, string>,
): {
    finalQuery: string;
    fallbackQuery?: string;
} {
    if (searchQuery?.es) {
        return {
            finalQuery: searchQuery.es,
            fallbackQuery: searchQuery.en,
        };
    }

    if (searchQuery?.en) {
        return {
            finalQuery: searchQuery.en,
        };
    }

    return {
        finalQuery: claim,
    };
}
