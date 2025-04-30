import { AgentPromptRole } from '@/shared/types/enums/agent-prompt.types';

/**
 * Representa un fragmento de prompt utilizado por un agente IA en el sistema.
 */
export class AgentPrompt {
    /* Identificador único del prompt. */
    id!: string;

    /* Nombre del agente asociado al prompt. */
    agent!: string;

    /* Tipo de funcionalidad a la que está asociado el prompt. */
    type!: string;

    /* Rol dentro del flujo de prompting (system, user, assistant, etc.). */
    role!: AgentPromptRole;

    /* Contenido textual completo del prompt. */
    content!: string;

    /* Fecha de creación del prompt. */
    createdAt!: Date;

    /* Fecha de última actualización del prompt. */
    updatedAt!: Date;
}
