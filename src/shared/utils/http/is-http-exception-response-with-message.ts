/**
 * Verifica si una respuesta HTTP de excepción contiene una propiedad `message` de tipo string.
 * Útil para manejar errores estándar con mensajes simples.
 */
export function isHttpExceptionResponseWithMessage(
    res: unknown,
): res is { message: string } {
    return (
        typeof res === 'object' &&
        res !== null &&
        'message' in res &&
        typeof (res as Record<string, unknown>).message === 'string'
    );
}
