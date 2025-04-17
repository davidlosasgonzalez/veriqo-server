/**
 * Resultado factual de un claim tras verificación por parte de un agente.
 */
export type VerificationVerdict =
    | 'true' // La afirmación es verificablemente verdadera
    | 'false' // La afirmación es falsa
    | 'possibly_true' // No se puede confirmar con certeza, pero parece cierta
    | 'unknown'; // No se encontró evidencia suficiente
