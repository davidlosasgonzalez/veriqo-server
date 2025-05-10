import { type FactCategory } from '@/shared/domain/enums/fact-category.enum';
import { type FactStatus } from '@/shared/domain/enums/fact-status.enum';

/**
 * Contrato de creación de AgentFact a partir de un AgentFinding validado.
 * Define los parámetros necesarios para crear un nuevo `AgentFact` después de una validación.
 */
export interface CreateFactFromValidatedFindingParams {
    status: FactStatus;
    category: FactCategory;
    reasoning: string;
    summary?: string;
}
