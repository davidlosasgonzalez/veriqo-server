/**
 * Contrato para generación de embeddings a partir de texto.
 */
export interface IEmbeddingService {
    generate(input: string): Promise<number[]>;
}
