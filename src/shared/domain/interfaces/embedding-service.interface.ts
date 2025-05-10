export interface IEmbeddingService {
    generate(input: string): Promise<number[]>;
}
