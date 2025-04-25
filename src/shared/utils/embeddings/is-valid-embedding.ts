/**
 * Verifica que el valor sea un vector numérico válido.
 *
 * @param value Valor a comprobar.
 * @returns true si es un array de números.
 */
export function isValidEmbedding(value: unknown): value is number[] {
    return (
        Array.isArray(value) &&
        value.length > 0 &&
        value.every((x) => typeof x === 'number')
    );
}
