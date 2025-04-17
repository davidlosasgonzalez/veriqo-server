import { isValidEmbedding } from './is-valid-embedding';

/**
 * Calcula la similitud coseno entre dos vectores numéricos.
 * @param a Embedding A
 * @param b Embedding B
 * @returns Valor de similitud entre -1 y 1 (o NaN si son inválidos)
 */
export function vectorSimilarity(a: number[], b: number[]): number {
    if (!isValidEmbedding(a) || !isValidEmbedding(b)) {
        console.warn('[⚠️ vectorSimilarity] Embedding inválido detectado:', {
            aSample: a?.slice?.(0, 5),
            bSample: b?.slice?.(0, 5),
            aType: typeof a,
            bType: typeof b,
        });
        return NaN;
    }

    const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai ** 2, 0));
    const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi ** 2, 0));

    if (!magA || !magB) {
        console.warn('[⚠️ vectorSimilarity] Magnitud 0 detectada:', {
            magA,
            magB,
        });
        return NaN;
    }

    return dot / (magA * magB);
}
