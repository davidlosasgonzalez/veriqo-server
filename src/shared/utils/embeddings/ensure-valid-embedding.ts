import { isValidEmbedding } from './is-valid-embedding';

/**
 * Asegura que un embedding generado sea válido. Reintenta si es necesario.
 * Si el embedding no es válido, la función llamará a la lógica de reintento y verificará nuevamente.
 *
 * @param raw - Valor devuelto por el proveedor de embeddings, generalmente un array numérico.
 * @param retry - Función que implementa la lógica de reintento para obtener un embedding válido.
 * @returns El vector de embedding validado como un array de números.
 * @throws Error Si no se puede obtener un embedding válido tras el reintento.
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
