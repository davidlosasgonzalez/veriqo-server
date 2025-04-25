/**
 * Calcula la similitud coseno entre dos vectores numéricos.
 *
 * @param a Primer vector.
 * @param b Segundo vector.
 * @returns Valor de similitud entre -1 y 1.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
        throw new Error('Los vectores deben tener la misma dimensión');
    }

    const dot = a.reduce((acc, val, i) => acc + val * b[i], 0);
    const normA = Math.sqrt(a.reduce((acc, val) => acc + val * val, 0));
    const normB = Math.sqrt(b.reduce((acc, val) => acc + val * val, 0));

    if (normA === 0 || normB === 0) {
        return 0;
    }

    return dot / (normA * normB);
}
