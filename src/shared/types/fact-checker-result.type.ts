import { VerificationVerdict } from './verification-verdict.type';

/**
 * Representa la respuesta final del agente FactChecker.
 */
export type FactCheckerResult = {
    claim: string;
    status: VerificationVerdict;
    sources: string[];
    checkedAt: string;
    reasoning: string;
    sources_retrieved: string[];
    sources_used: string[];
    findingId?: string;
    equivalentToClaim?: string;
};
