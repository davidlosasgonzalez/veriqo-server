/**
 * Verifica si un objeto es un embedding válido: array numérico con valores finitos.
 * @param embedding - Vector a validar.
 * @returns `true` si es un vector de números finitos.
 */
export function isValidEmbedding(embedding: unknown): embedding is number[] {
    return (
        Array.isArray(embedding) &&
        embedding.length > 0 &&
        embedding.every(
            (value) => typeof value === 'number' && Number.isFinite(value),
        )
    );
}
