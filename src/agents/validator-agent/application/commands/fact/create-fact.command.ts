import { CreateFactPayload } from './payloads/create-fact.payload';

export class CreateFactCommand {
    constructor(public readonly payload: CreateFactPayload) {}
}
