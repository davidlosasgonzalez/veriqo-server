import { GetFindingByClaimPayload } from './payloads/get-finding-by-claim.payload';

export class GetFindingByClaimQuery {
    constructor(public readonly payload: GetFindingByClaimPayload) {}
}
