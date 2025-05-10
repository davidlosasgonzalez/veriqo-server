import { Fact } from '../entities/fact';
import { type FactCategory } from '../enums/fact-category.enum';
import { type FactStatus } from '../enums/fact-status.enum';

export interface IFactRepository {
    save(fact: Fact): Promise<Fact>;

    findById(id: string): Promise<Fact | null>;

    findAll(): Promise<Fact[]>;

    /** Actualiza estado, categoría y razonamiento de un Fact tras verificación. */
    updateAfterVerification(params: {
        factId: string;
        newStatus: FactStatus;
        newCategory: FactCategory;
        newReasoning: {
            summary: string;
            content: string;
        };
    }): Promise<void>;

    /** Actualiza solo estado y categoría de un Fact (sin razonamiento). */
    updateStatusAndCategory(params: {
        factId: string;
        newStatus: FactStatus;
        newCategory: FactCategory;
    }): Promise<void>;
}
