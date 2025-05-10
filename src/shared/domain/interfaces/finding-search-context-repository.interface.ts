import { FindingSearchContext } from '../../../agents/validator-agent/domain/entities/finding-search-context';

export interface IFindingSearchContextRepository {
    save(context: FindingSearchContext): Promise<FindingSearchContext>;
}
