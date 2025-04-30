/**
 * Construye una query básica para usar en motores de búsqueda.
 *
 * @param text - Texto original.
 * @returns Query simple, el texto original sin cambios.
 */
export function buildSimpleQuery(text: string): string {
    return text.trim();
}
