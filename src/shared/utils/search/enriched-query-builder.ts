/**
 * Genera una query básica combinando palabras clave, sinónimos y filtros por dominio.
 */
export function buildSimpleSearchQuery(
    claim: string,
    keywords: string[] = [],
    synonyms: string[] = [],
    siteFilters: string[] = [],
): string {
    const parts = [...keywords, ...synonyms]
        .map((term) => term.trim())
        .filter((t) => t.length > 2);

    const baseQuery = parts.length > 0 ? parts.join(' ') : claim;
    const sitePart =
        siteFilters.length > 0
            ? siteFilters.map((s) => `site:${s}`).join(' OR ')
            : '';

    return `${baseQuery} ${sitePart}`.trim();
}
