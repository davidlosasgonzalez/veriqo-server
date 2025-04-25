/**
 * Garantiza que el valor puede ser validado como un objeto.
 * Si el valor no es un objeto válido, lanza un error.
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
