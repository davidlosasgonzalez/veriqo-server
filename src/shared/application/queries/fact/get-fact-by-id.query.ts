import { GetFactByIdPayload } from './payloads/get-fact-by-id.payload';

export class GetFactByIdQuery {
    constructor(public readonly payload: GetFactByIdPayload) {}
}
