import { isValidEmbedding } from './is-valid-embedding';

/**
 * Garantiza que el embedding proporcionado sea válido.
 * Si no lo es, intenta regenerarlo con un callback y valida el nuevo resultado.
 *
 * @param raw Embedding original recibido
 * @param retry Callback para intentar regenerarlo si es inválido
 * @returns Un array de números válidos
 * @throws Error si el embedding sigue siendo inválido tras el reintento
 */
export async function ensureValidEmbedding(
    raw: unknown,
    retry: () => Promise<unknown>,
): Promise<number[]> {
    if (isValidEmbedding(raw)) return raw;

    console.warn('[Embedding inválido] Intentando regenerar...');
    const regenerated = await retry();

    if (!isValidEmbedding(regenerated)) {
        throw new Error('[Embedding inválido] tras reintento.');
    }

    return regenerated;
}
