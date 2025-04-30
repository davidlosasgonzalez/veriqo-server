import { encoding_for_model, TiktokenModel } from '@dqbd/tiktoken';

/**
 * Estima el número de tokens para un texto dado según el modelo especificado.
 * @param text Texto a tokenizar.
 * @param model Modelo LLM.
 * @returns Número estimado de tokens.
 */
export function countTokens(text: string, model: TiktokenModel): number {
    const encoder = encoding_for_model(model);
    const tokens = encoder.encode(text);

    encoder.free();

    return tokens.length;
}
