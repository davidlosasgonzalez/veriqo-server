/**
 * Resultado factual de un claim tras verificación por parte de un agente.
 */
export type VerificationVerdict =
    | 'true' // La afirmación es verificablemente verdadera
    | 'false' // La afirmación es falsa
    | 'possibly_true' // No se puede confirmar con certeza, pero parece cierta
    | 'unknown'; // No se encontró evidencia suficiente

const validVerdicts: readonly VerificationVerdict[] = [
    'true',
    'false',
    'possibly_true',
    'unknown',
];

/**
 * Verifica si un valor es un `VerificationVerdict` válido.
 *
 * @param value Valor a comprobar.
 * @returns `true` si pertenece al conjunto de veredictos válidos.
 */
export function isVerificationVerdict(
    value: unknown,
): value is VerificationVerdict {
    return (
        typeof value === 'string' &&
        validVerdicts.includes(value as VerificationVerdict)
    );
}
