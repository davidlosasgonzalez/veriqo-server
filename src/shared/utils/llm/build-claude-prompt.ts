import { LlmMessage } from '@/shared/domain/value-objects/llm-message.vo';

/**
 * Construye un mensaje único tipo 'user' para Claude fusionando instrucciones + texto.
 * Claude no interpreta 'system' como OpenAI, por lo que todo debe ir como un solo mensaje de usuario.
 *
 * @param systemContent - Texto del sistema (instrucciones) que debe ser enviado al modelo.
 * @param userContent - Texto del usuario (input principal) que debe ser procesado por el modelo.
 * @returns Un array con un único `LlmMessage` de tipo 'user', que contiene las instrucciones y el texto del usuario.
 */
export function buildClaudePrompt(
    systemContent: string,
    userContent: string,
): LlmMessage[] {
    return [
        {
            role: 'user',
            content: `${systemContent.trim()}\n\nTexto a analizar:\n${userContent.trim()}`,
        },
    ] satisfies LlmMessage[];
}
