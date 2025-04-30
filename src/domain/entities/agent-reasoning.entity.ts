/**
 * Representa el contenido de un razonamiento generado por un agente.
 */
export class AgentReasoning {
    /** Identificador único del razonamiento. */
    id!: string;

    /** Resumen breve del razonamiento. */
    summary!: string;

    /** Contenido completo del razonamiento. */
    content!: string;

    /** ID de la verificación que originó este razonamiento (si aplica). */
    verificationId?: string | null;

    /** ID del fact asociado directamente (si no proviene de verificación externa). */
    factId?: string | null;

    /** Fecha de creación. */
    createdAt!: Date;

    /** Fecha de actualización. */
    updatedAt!: Date;
}
