import { UpdateFactAfterVerificationUseCase } from './fact/update-fact-after-verification.use-case';
import { VerifyFactUseCase } from './fact/verify-fact.use-case';

export const WriteUseCases = [
    VerifyFactUseCase,
    UpdateFactAfterVerificationUseCase,
];
