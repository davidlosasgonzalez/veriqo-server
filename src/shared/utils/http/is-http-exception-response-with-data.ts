/**
 * Verifica si una respuesta HTTP de excepción contiene una propiedad `data`.
 * Útil para errores personalizados con datos estructurados.
 */
export function isHttpExceptionResponseWithData(
    res: unknown,
): res is { data: unknown } {
    return typeof res === 'object' && res !== null && 'data' in res;
}
