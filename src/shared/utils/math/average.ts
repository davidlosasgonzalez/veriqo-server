/**
 * Calcula el promedio de un array de números, redondeado a 2 decimales.
 */
export function average(values: number[]): number {
    if (!values.length) return 0;
    const sum = values.reduce((a, b) => a + b, 0);
    return Math.round((sum / values.length) * 100) / 100;
}
