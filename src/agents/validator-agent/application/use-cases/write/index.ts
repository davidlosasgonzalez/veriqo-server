import { CreateFactUseCase } from './fact/create-fact.use-case';
import { CreateFindingUseCase } from './finding/create-finding.use-case';
import { CreateReasoningUseCase } from './reasoning/create-reasoning.use-case';

export const ValidatorWriteUseCases = [
    CreateFactUseCase,
    CreateFindingUseCase,
    CreateReasoningUseCase,
];
