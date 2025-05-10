import { GetAgentLogsPayload } from './payloads/get-agent-logs.payload';

export class GetAgentLogsQuery {
    constructor(public readonly payload: GetAgentLogsPayload = {}) {}
}
