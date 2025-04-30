/**
 * Garantiza que el valor puede ser validado como un objeto.
 * Si el valor no es un objeto válido, lanza un error.
 *
 * @param input - El valor a validar.
 * @throws Error Si el valor no es un objeto no nulo.
 * @returns El valor validado como un objeto (Record<string, unknown>).
 */
export function ensureValidatableObject(
    input: unknown,
): Record<string, unknown> {
    if (typeof input !== 'object' || input === null || Array.isArray(input)) {
        throw new Error(
            'Valor recibido inválido para validación: se esperaba un objeto no nulo.',
        );
    }

    return input as Record<string, unknown>;
}
