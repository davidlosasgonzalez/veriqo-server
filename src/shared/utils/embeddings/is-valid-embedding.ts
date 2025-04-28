/**
 * Verifica que el valor sea un vector numérico válido.
 * Se asegura de que el valor sea un array de números y que tenga al menos un elemento.
 *
 * @param value - Valor a comprobar para verificar si es un embedding válido.
 * @returns `true` si el valor es un array de números válido, de lo contrario `false`.
 */
export function isValidEmbedding(value: unknown): value is number[] {
    return (
        Array.isArray(value) &&
        value.length > 0 &&
        value.every((x) => typeof x === 'number')
    );
}
