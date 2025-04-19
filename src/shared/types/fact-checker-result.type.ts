import { VerificationVerdict } from './verification-verdict.type';

/**
 * Representa la respuesta final del agente FactChecker.
 */
export type FactCheckerResult = {
    id: string;
    claim: string;
    status: VerificationVerdict;
    checkedAt: string;
    reasoning: string | null;
    sources_retrieved: string[];
    sources_used: string[];
    findingId?: string;
    equivalentToClaim?: string;
};
