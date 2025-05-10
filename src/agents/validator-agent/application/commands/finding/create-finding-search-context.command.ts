import { CreateFindingSearchContextPayload } from './payloads/create-finding-search-context.payload';

export class CreateFindingSearchContextCommand {
    constructor(public readonly payload: CreateFindingSearchContextPayload) {}
}
