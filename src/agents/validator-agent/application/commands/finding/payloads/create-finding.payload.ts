import { Fact } from '@/shared/domain/entities/fact';

/**
 * Payload necesario para crear un nuevo Finding.
 */
export interface CreateFindingPayload {
    claim: string;
    fact: Fact;
    embedding: number[];
    needsFactCheckReason?: string | null;
}
