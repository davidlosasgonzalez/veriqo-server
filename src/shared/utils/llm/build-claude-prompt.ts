import { LlmMessage } from '@/shared/types/llm-message.type';

/**
 * Construye un único mensaje válido para Claude combinando un prompt de sistema y uno de usuario.
 * Claude no admite role 'system', por lo que este contenido se incluye como parte del mensaje 'user'.
 *
 * @param systemPrompt Texto del sistema (instrucciones del agente).
 * @param userPrompt Texto del usuario, con el contenido principal o claim.
 * @returns Mensaje LLM con role 'user' y contenido interpolado.
 */
export function buildClaudePrompt(
    systemPrompt: string,
    userPrompt: string,
): LlmMessage {
    return {
        role: 'user',
        content: `---SYSTEM---\n${systemPrompt}\n\n---USER---\n${userPrompt}`,
    };
}
