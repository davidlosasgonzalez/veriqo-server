/**
 * Calcula la similitud coseno entre dos vectores numéricos.
 * La similitud coseno se utiliza para medir la relación entre dos vectores en un espacio de alta dimensión,
 * especialmente útil en el análisis de datos, como en modelos de lenguaje y vectores de características.
 *
 * @param a - Primer vector numérico.
 * @param b - Segundo vector numérico.
 * @throws Error Si los vectores no tienen la misma dimensión.
 * @returns Valor de similitud entre -1 y 1. Un valor de 1 indica que los vectores son idénticos,
 * 0 indica que son ortogonales (sin similitud) y -1 indica que son opuestos.
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
