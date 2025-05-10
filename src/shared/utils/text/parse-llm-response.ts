/**
 * Extrae y parsea de forma segura un objeto JSON desde una cadena bruta generada por un modelo LLM.
 *
 * Esta función sanea el texto eliminando cualquier contenido fuera del bloque JSON,
 * y lanza un error si el objeto resultante no puede ser parseado o está vacío.
 *
 * @template T Tipo esperado del objeto JSON resultante.
 * @param rawOutput - Texto completo recibido desde el modelo LLM, que puede contener basura antes o después del JSON.
 * @throws Error si no se puede recuperar un JSON válido o si el bloque está estructuralmente incompleto.
 * @returns Objeto JSON parseado con tipo genérico T.
 */
export function parseLlmResponse<T = Record<string, string>>(
    rawOutput: string,
): T {
    try {
        const firstBrace = rawOutput.indexOf('{');
        const lastBrace = rawOutput.lastIndexOf('}');

        if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
            throw new Error('No se encontró un bloque JSON válido.');
        }

        const possibleJson = rawOutput.slice(firstBrace, lastBrace + 1);
        const parsed = JSON.parse(possibleJson);

        if (!parsed || typeof parsed !== 'object') {
            throw new Error(
                'El JSON parseado es nulo o no tiene formato de objeto.',
            );
        }

        return parsed as T;
    } catch (err) {
        this.logger.error(
            'Error al parsear la respuesta del modelo',
            err instanceof Error ? err.stack : String(err),
        );

        throw new Error(
            `Error al parsear la respuesta del modelo: ${
                err instanceof Error ? err.message : String(err)
            }`,
        );
    }
}
