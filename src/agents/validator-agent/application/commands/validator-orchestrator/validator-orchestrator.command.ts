import { ValidatorOrchestratorPayload } from './payloads/validator-orchestrator.payload';

export class ValidatorOrchestratorCommand {
    constructor(public readonly payload: ValidatorOrchestratorPayload) {}
}
