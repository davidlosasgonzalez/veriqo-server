import { Verification } from '../entities/verification';

export interface IVerificationRepository {
    save(verification: Verification): Promise<Verification>;

    findById(id: string): Promise<Verification | null>;
}
