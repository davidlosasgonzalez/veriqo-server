import { UpdateFactAfterVerificationPayload } from './payloads/update-fact-after-verification.payload';

export class UpdateFactAfterVerificationCommand {
    constructor(public readonly payload: UpdateFactAfterVerificationPayload) {}
}
