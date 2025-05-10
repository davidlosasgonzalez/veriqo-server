import { type FactCategory } from '@/shared/domain/enums/fact-category.enum';
import { type FactStatus } from '@/shared/domain/enums/fact-status.enum';

export interface CreateFactPayload {
    status: FactStatus;
    category: FactCategory;
}
