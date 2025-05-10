import { FactCategory } from '@/shared/domain/enums/fact-category.enum';
import { FactStatus } from '@/shared/domain/enums/fact-status.enum';

export interface UpdateFactAfterVerificationPayload {
    factId: string;
    newStatus: FactStatus;
    newCategory: FactCategory;
}
