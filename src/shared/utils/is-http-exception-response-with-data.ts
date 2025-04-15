export function isHttpExceptionResponseWithData(
    res: unknown,
): res is { data: unknown } {
    return typeof res === 'object' && res !== null && 'data' in res;
}
