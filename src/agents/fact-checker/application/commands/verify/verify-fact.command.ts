import { VerifyFactPayload } from './payloads/verify-fact.payload';

export class VerifyFactCommand {
    constructor(public readonly payload: VerifyFactPayload) {}
}
