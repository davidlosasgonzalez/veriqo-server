import { CreateReasoningPayload } from './payloads/create-reasoning.payload';

export class CreateReasoningCommand {
    constructor(public readonly payload: CreateReasoningPayload) {}
}
