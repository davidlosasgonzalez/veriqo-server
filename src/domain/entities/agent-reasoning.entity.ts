/**
 * Representa el contenido de un razonamiento generado por un agente.
 */
export class AgentReasoning {
    /* Identificador único del razonamiento. */
    id!: string;

    /* Resumen del razonamiento. */
    summary!: string;

    /* Contenido completo del razonamiento. */
    content!: string;

    /* Fecha de creación. */
    createdAt!: Date;

    /* Fecha de actualización. */
    updatedAt!: Date;
}
