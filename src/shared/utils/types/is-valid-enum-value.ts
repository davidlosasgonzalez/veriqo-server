/**
 * Verifica si un valor pertenece a un enum (enum basado en valores).
 *
 * @param enumObj - El objeto enum a comprobar.
 * @param value - El valor a validar.
 * @returns true si el valor está en el enum, false si no.
 */
export function isValidEnumValue<T extends Record<string, string>>(
    enumObj: T,
    value: unknown,
): value is T[keyof T] {
    return typeof value === 'string' && Object.values(enumObj).includes(value);
}
