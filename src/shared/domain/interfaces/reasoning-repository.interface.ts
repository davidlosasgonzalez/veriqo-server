import { Reasoning } from '../entities/reasoning';

export interface IReasoningRepository {
    save(reasoning: Reasoning): Promise<Reasoning>;
}
