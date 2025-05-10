import { Finding } from '../../../agents/validator-agent/domain/entities/finding';

export interface IFindingRepository {
    save(finding: Finding): Promise<Finding>;

    saveMany(findings: Finding[]): Promise<void>;

    findById(id: string): Promise<Finding | null>;

    findAll(): Promise<Finding[]>;

    findByClaim(claim: string): Promise<Finding | null>;

    /** Busca el Finding con embedding más similar que supere un umbral. */
    findMostSimilarEmbedding(
        vector: number[],
        threshold: number,
    ): Promise<Finding | null>;
}
