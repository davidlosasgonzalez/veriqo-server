import { ValidatedClaimResultPayload } from '@/agents/validator-agent/application/dto/validated-claim-result.payload';
import { FACT_CATEGORY } from '@/shared/domain/enums/fact-category.enum';
import { FACT_STATUS } from '@/shared/domain/enums/fact-status.enum';
import { ValidatedClaimResultRaw } from '@/shared/types/parsed-types/validated-claim-result-raw.type';

/**
 * Mapea un resultado LLM crudo a un payload de validación fuerte con enums y control de tipos.
 *
 * @param raw - Resultado sin tipar devuelto por el modelo.
 * @returns Payload con tipos seguros para ser usado en lógica de dominio.
 * @throws Error si `status` o `category` no son válidos.
 */
export function mapToValidatedClaimResult(
    raw: ValidatedClaimResultRaw,
): ValidatedClaimResultPayload {
    const validStatus = Object.values(FACT_STATUS) as string[];
    const validCategory = Object.values(FACT_CATEGORY) as string[];

    if (!validStatus.includes(raw.status)) {
        throw new Error(`FactStatus inválido: ${raw.status}`);
    }

    if (!validCategory.includes(raw.category)) {
        throw new Error(`FactCategory inválido: ${raw.category}`);
    }

    return {
        status: raw.status as (typeof FACT_STATUS)[keyof typeof FACT_STATUS],
        category:
            raw.category as (typeof FACT_CATEGORY)[keyof typeof FACT_CATEGORY],
        summary: raw.summary,
        reasoning: raw.reasoning,
        needsFactCheckReason: raw.needsFactCheckReason,
        searchQuery: raw.searchQuery,
        siteSuggestions: raw.siteSuggestions,
    };
}
