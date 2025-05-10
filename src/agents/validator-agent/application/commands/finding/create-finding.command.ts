import { CreateFindingPayload } from './payloads/create-finding.payload';

export class CreateFindingCommand {
    constructor(public readonly payload: CreateFindingPayload) {}
}
