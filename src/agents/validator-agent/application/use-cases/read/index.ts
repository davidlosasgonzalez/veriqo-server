import { FindAllFindingsUseCase } from './finding/find-all-findings.use-case';
import { GetFindingByClaimUseCase } from './finding/get-finding-by-claim.use-case';
import { GetFindingByIdUseCase } from './finding/get-finding-by-id.use-case';
import { NormalizeClaimsUseCase } from './normalize/normalize-claims.use-case';

export const ValidatorReadUseCases = [
    FindAllFindingsUseCase,
    GetFindingByClaimUseCase,
    GetFindingByIdUseCase,
    NormalizeClaimsUseCase,
];
