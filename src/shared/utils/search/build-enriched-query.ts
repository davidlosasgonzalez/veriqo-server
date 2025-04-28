/**
 * Construye una query enriquecida a partir de palabras clave y sinónimos.
 *
 * @param keywords - Palabras clave.
 * @param synonyms - Diccionario de sinónimos (opcional).
 * @returns Query enriquecida, con los sinónimos añadidos como términos alternativos.
 */
export function buildEnrichedQuery(
    keywords: string[],
    synonyms?: Record<string, string[]>,
): string {
    const parts: string[] = [];

    for (const keyword of keywords) {
        parts.push(`"${keyword}"`);

        if (synonyms?.[keyword]) {
            parts.push(...synonyms[keyword].map((syn) => `"${syn}"`));
        }
    }

    return parts.join(' OR ');
}
