import { AgentFinding } from '@/domain/entities/agent-finding.entity';
import { ParsedFinding } from '@/shared/types/parsed-finding.type';

/**
 * Transforma un objeto ParsedFinding en una entidad de dominio AgentFinding.
 * Esta función se utiliza tras el análisis del modelo que descompone el texto en afirmaciones.
 *
 * @param parsed - Objeto extraído de la respuesta del modelo LLM.
 * @returns Instancia lista para ser persistida como AgentFinding.
 */
export function mapParsedFindingToAgentFinding(
    parsed: ParsedFinding,
): AgentFinding {
    const now = new Date();
    const finding = new AgentFinding();

    finding.claim = parsed.claim;
    finding.needsFactCheckReason = parsed.needsFactCheckReason ?? null;
    finding.createdAt = now;
    finding.updatedAt = now;

    return finding;
}
