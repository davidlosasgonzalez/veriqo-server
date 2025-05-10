import { Finding } from '@/agents/validator-agent/domain/entities/finding';
import { Verification } from '@/shared/domain/entities/verification';

/**
 * Limpia los factId vacíos de las verifications dentro de uno o varios findings.
 *
 * @param findings - Finding o array de findings a limpiar.
 */
export function sanitizeFindings(findings: Finding | Finding[] | null): void {
    if (!findings) return;

    const findingsArray = Array.isArray(findings) ? findings : [findings];

    for (const finding of findingsArray) {
        const verifications: Verification[] =
            finding.getFact()?.getVerifications() ?? [];

        for (const verification of verifications) {
            if (!verification.getFactId()) {
                verification.unsetFactId();
            }
        }
    }
}
