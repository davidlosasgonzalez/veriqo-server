import { AgentFact } from '@/domain/entities/agent-fact.entity';
import { AgentReasoning } from '@/domain/entities/agent-reasoning.entity';
import { CreateFactFromValidatedFindingParams } from '@/shared/interfaces/agent-fact.interfaces';

/**
 * Crea un AgentFact utilizando los datos validados por el primer agente.
 * Solo se invoca cuando el modelo puede resolver internamente la afirmación.
 *
 * @param createdAt - Fecha base para timestamps, que se utilizará tanto para `createdAt` como `updatedAt`.
 * @param status - Estado factual resultante. Puede ser 'validated' o 'rejected'.
 * @param category - Categoría semántica del hecho. Puede ser null si no se asigna.
 * @param reasoning - Razonamiento completo generado por el modelo, explicando por qué se asignó el estado.
 * @param summary - Resumen opcional del razonamiento. Si no se proporciona, se asigna un string vacío.
 * @returns El objeto `AgentFact` creado, sin razonamiento asignado directamente (debe guardarse por separado).
 */
export function createFactFromValidatedFinding(
    createdAt: Date,
    {
        status,
        category,
        reasoning,
        summary,
    }: CreateFactFromValidatedFindingParams,
): AgentFact {
    const fact = new AgentFact();

    fact.status = status;
    fact.category = category;
    fact.createdAt = createdAt;
    fact.updatedAt = createdAt;

    return fact;
}
