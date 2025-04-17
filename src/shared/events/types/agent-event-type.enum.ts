/**
 * Tipos de eventos disponibles en el bus de eventos entre agentes.
 * Se utilizan como claves en la propiedad `type` de los eventos.
 */
export enum AgentEventType {
    /**
     * El ValidatorAgent requiere una verificación factual por parte del FactCheckerAgent.
     */
    FACTUAL_CHECK_REQUIRED = 'factual_check_required',

    /**
     * El FactCheckerAgent devuelve un resultado factual.
     */
    FACTUAL_VERIFICATION_RESULT = 'factual_verification_result',

    /**
     * El ValidatorAgent genera retroalimentación de validación (hallazgos).
     */
    VALIDATION_FEEDBACK = 'validation_feedback',

    /**
     * Se solicita una optimización (ej: mejora de prompt o razonamiento).
     */
    OPTIMIZATION_REQUESTED = 'optimization_requested',

    /**
     * Se devuelve el resultado de una optimización.
     */
    OPTIMIZATION_RESULT = 'optimization_result',

    /**
     * Resultado generado por el agente razonador.
     */
    REASONING_RESULT = 'reasoning_result',
}
