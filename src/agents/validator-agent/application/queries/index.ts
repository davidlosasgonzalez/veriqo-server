import { FindAllFindingsHandler } from './finding/find-all-findings.handler';
import { GetFindingByClaimHandler } from './finding/get-finding-by-claim.handler';
import { GetFindingByIdHandler } from './finding/get-finding-by-id.handler';
import { NormalizeClaimsHandler } from './normalize/normalize-claim.handler';

export const ValidatorQueryHandlers = [
    FindAllFindingsHandler,
    GetFindingByClaimHandler,
    GetFindingByIdHandler,
    NormalizeClaimsHandler,
];
