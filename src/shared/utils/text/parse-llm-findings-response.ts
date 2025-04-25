import { ParsedFinding } from '@/shared/types/parsed-finding.type';

/**
 * Intenta parsear una respuesta textual del modelo LLM en ParsedFinding[].
 * Lanza un error si no es JSON válido o no contiene una estructura esperada.
 * @param rawOutput Respuesta cruda del modelo
 */
export function parseLlmFindingsResponse(rawOutput: string): ParsedFinding[] {
    try {
        const parsed = JSON.parse(rawOutput);

        if (!parsed || parsed.status !== 'ok' || !Array.isArray(parsed.data)) {
            throw new Error(
                'Respuesta del modelo mal estructurada o incompleta.',
            );
        }

        return parsed.data;
    } catch (err) {
        throw new Error(
            `Error al parsear la respuesta del modelo: ${(err as Error).message}`,
        );
    }
}
