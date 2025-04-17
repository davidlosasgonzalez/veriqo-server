import { VerificationVerdict } from '@/shared/types/verification-verdict.type';

export type ParsedLLMResponse = {
    status: VerificationVerdict;
    reasoning?: string;
    sources_used?: string[];
};
