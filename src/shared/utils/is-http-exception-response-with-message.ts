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
