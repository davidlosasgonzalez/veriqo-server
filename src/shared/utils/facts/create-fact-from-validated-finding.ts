import { AgentFact } from '@/domain/entities/agent-fact.entity';
import { AgentReasoning } from '@/domain/entities/agent-reasoning.entity';
import { CreateFactFromValidatedFindingParams } from '@/shared/interfaces/agent-fact.interfaces';

/**
 * Crea un AgentFact utilizando los datos validados por el primer agente.
 * Solo se invoca cuando el modelo puede resolver internamente la afirmación.
 *
 * @param createdAt - Fecha base para timestamps
 * @param status - Estado factual resultante (validated | rejected)
 * @param category - Categoría semántica del hecho
 * @param reasoning - Razonamiento completo generado por el modelo
 * @param summary - Resumen opcional del razonamiento
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

    const reasoningEntity = new AgentReasoning();

    reasoningEntity.content = reasoning;
    reasoningEntity.summary = summary ?? '';
    reasoningEntity.createdAt = createdAt;
    reasoningEntity.updatedAt = createdAt;

    fact.reasoning = reasoningEntity;

    return fact;
}
