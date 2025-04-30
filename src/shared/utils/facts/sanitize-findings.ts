import { AgentFinding } from '@/domain/entities/agent-finding.entity';

/**
 * Limpia los factId vacíos de las verifications dentro de uno o varios findings.
 *
 * @param findings - Finding o array de findings a limpiar.
 */
export function sanitizeFindings(
    findings: AgentFinding | AgentFinding[] | null,
): void {
    if (!findings) return;

    const findingsArray = Array.isArray(findings) ? findings : [findings];

    for (const finding of findingsArray) {
        const verifications = finding.fact?.verifications ?? [];

        for (const verification of verifications) {
            if (!verification.factId) {
                delete (verification as any).factId;
            }
        }
    }
}
