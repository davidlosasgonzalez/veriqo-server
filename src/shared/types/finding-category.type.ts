/**
 * Categorías posibles para un hallazgo generado por un agente de validación factual.
 */
export type FindingCategory =
    | 'factual_error' // Afirmación falsa o engañosa
    | 'contradiction' // El claim contradice otra información verificada
    | 'ambiguity' // El claim es ambiguo o carece de contexto
    | 'reasoning' // Error en el razonamiento lógico
    | 'style' // Problemas de redacción, claridad o tono
    | 'other'; // Otro tipo de problema no clasificado
