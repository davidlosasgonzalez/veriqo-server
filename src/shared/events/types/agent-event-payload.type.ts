/**
 * Estructura base de un evento emitido entre agentes del sistema.
 * Contiene metainformación del tipo y el agente emisor, más el payload tipado.
 *
 * @template T Tipo del payload (estructura del `data`)
 */
export type AgentEventPayload<T = any> = {
    /** Tipo de evento (clave del sistema de eventos) */
    type: string;

    /** Nombre del agente que emitió el evento */
    sourceAgent: string;

    /** Cuerpo del evento con los datos específicos */
    data: T;
};
