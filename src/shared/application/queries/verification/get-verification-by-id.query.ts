import { GetVerificationByIdPayload } from './payloads/get-verification-by-id.payload';

export class GetVerificationByIdQuery {
    constructor(public readonly payload: GetVerificationByIdPayload) {}
}
