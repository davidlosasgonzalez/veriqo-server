import { isValidEmbedding } from './is-valid-embedding';

/**
 * Asegura que un embedding generado sea válido. Reintenta si es necesario.
 *
 * @param raw Valor devuelto por el proveedor de embeddings.
 * @param retry Lógica de reintento si el valor no es válido.
 * @returns Vector de embedding validado.
 * @throws Error si no se puede obtener un embedding válido.
 */
export async function ensureValidEmbedding(
    raw: unknown,
    retry: () => Promise<unknown>,
): Promise<number[]> {
    let result = raw;

    if (!isValidEmbedding(result)) {
        result = await retry();
    }

    if (!isValidEmbedding(result)) {
        throw new Error('El embedding generado no es válido.');
    }

    return result as number[];
}
