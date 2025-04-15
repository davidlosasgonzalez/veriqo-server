export function generateSearchQuery(
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

export function buildSearchQueryFromValidatedData(
    claim: string,
    keywords: string[],
    synonymsMap: Record<string, string[]>,
    siteFilters: string[] = [],
): string {
    const flatSynonyms = Object.values(synonymsMap ?? {}).flat();

    const cleanedParts = [...keywords, ...flatSynonyms]
        .map((term) => term.trim())
        .filter((t) => t.length > 2);

    const quotedNameMatch = claim.match(
        /([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+\s){2,3}[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+/,
    );
    const quotedName = quotedNameMatch ? `"${quotedNameMatch[0].trim()}"` : '';

    const baseTerms = quotedName || claim;
    const enrichment = cleanedParts.slice(0, 6).join(' ');

    const sitePart =
        siteFilters.length > 0
            ? siteFilters.map((s) => `site:${s}`).join(' OR ')
            : '';

    return `${baseTerms} ${enrichment} ${sitePart}`.trim();
}
