export interface IAgentService<T = string> {
    /**
     * Ejecuta el agente con el prompt proporcionado.
     * @param prompt El prompt a procesar
     * @returns El resultado procesado por el agente, que puede ser un string o un tipo específico.
     */
    execute(prompt: string): Promise<T>;
}
