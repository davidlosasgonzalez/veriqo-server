/**
 * Construye una query con posibles filtros de sitio.
 *
 * @param base - Consulta base.
 * @param sites - Lista de URLs sugeridas.
 * @returns Query final enriquecida.
 */
export function enrichQueryWithSites(base: string, sites?: string[]): string {
    if (!sites?.length) return base;

    const siteFilter = sites
        .map((url) => `site:${new URL(url).hostname}`)
        .join(' OR ');

    return `${base} ${siteFilter}`;
}
