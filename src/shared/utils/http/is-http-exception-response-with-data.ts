/**
 * Verifica si una respuesta HTTP de excepción contiene una propiedad `data`.
 * Útil para errores personalizados con datos estructurados.
 *
 * @param res - La respuesta de excepción a verificar.
 * @returns `true` si la respuesta contiene la propiedad `data`, `false` en caso contrario.
 */
export function isHttpExceptionResponseWithData(
    res: unknown,
): res is { data: unknown } {
    return typeof res === 'object' && res !== null && 'data' in res;
}
