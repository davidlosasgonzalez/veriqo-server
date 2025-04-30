import { TiktokenModel } from '@dqbd/tiktoken';

const modelMap: Record<string, TiktokenModel> = {
    // OpenAI.
    'gpt-4o': 'gpt-4o',
    'text-embedding-3-small': 'text-embedding-3-small',

    // Anthropic (por aproximación, TikTok está basado en OpenAI).
    'claude-3-5-sonnet-20241022': 'gpt-4',
    'claude-3-7-sonnet-20250219': 'gpt-4',
};

/**
 * Mapea un modelo LLM de Veriqo a su equivalente válido para tiktoken.
 *
 * @param modelName Nombre del modelo configurado.
 * @returns Nombre compatible con tiktoken.
 */
export function mapToTiktokenModel(modelName: string): TiktokenModel {
    const mapped = modelMap[modelName];

    if (!mapped) {
        throw new Error(`Modelo no soportado para contar tokens: ${modelName}`);
    }

    return mapped;
}
