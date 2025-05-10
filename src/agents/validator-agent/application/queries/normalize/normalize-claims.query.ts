import { NormalizeClaimsPayload } from './payloads/normalize-claims.payload';

export class NormalizeClaimsQuery {
    constructor(public readonly payload: NormalizeClaimsPayload) {}
}
