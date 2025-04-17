/**
 * Interfaz base para cualquier agente del sistema (ej. ValidatorAgent, FactCheckerAgent).
 * Permite definir el contrato mínimo para ejecutar una tarea y devolver un resultado.
 *
 * @template T Tipo del valor devuelto por el agente (por defecto: string)
 */
export interface IAgentService<T = string> {
    /**
     * Ejecuta el agente con el prompt proporcionado.
     *
     * @param prompt El prompt a procesar
     * @returns El resultado generado por el agente
     */
    execute(prompt: string): Promise<T>;
}
