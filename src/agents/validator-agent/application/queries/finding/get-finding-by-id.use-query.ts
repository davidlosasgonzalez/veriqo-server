import { GetFindingByIdPayload } from './payloads/get-finding-by-id.payload';

export class GetFindingByIdQuery {
    constructor(public readonly payload: GetFindingByIdPayload) {}
}
