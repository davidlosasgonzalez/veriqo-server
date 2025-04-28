/**
 * Contrato para generación de embeddings a partir de texto.
 * Define el servicio que genera un vector numérico (embedding) a partir de un texto dado.
 */
export interface IEmbeddingService {
    generate(input: string): Promise<number[]>;
}
