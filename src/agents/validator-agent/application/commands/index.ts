import { CreateFactHandler } from './fact/create-fact.handler';
import { CreateFindingSearchContextHandler } from './finding/create-finding-search-context.handler';
import { CreateFindingHandler } from './finding/create-finding.handler';
import { CreateReasoningHandler } from './reasoning/create-reasoning.handler';
import { ValidatorOrchestratorHandler } from './validator-orchestrator/validator-orchestrator.handler';

export const ValidatorCommandHandlers = [
    CreateFactHandler,
    CreateFindingSearchContextHandler,
    CreateFindingHandler,
    CreateReasoningHandler,
    ValidatorOrchestratorHandler,
];
