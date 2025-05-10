import { GetPromptsPayload } from './payloads/get-prompts.payload';

export class GetPromptsQuery {
    constructor(public readonly payload: GetPromptsPayload = {}) {}
}
