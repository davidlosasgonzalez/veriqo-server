import { type AgentPromptRole } from '../enums/agent-prompt-role.enum';

export class AgentPrompt {
    constructor(
        private readonly id: string,
        private readonly agent: string,
        private readonly type: string,
        private readonly role: AgentPromptRole,
        private readonly content: string,
        private readonly createdAt: Date,
        private readonly updatedAt: Date,
    ) {
        if (!id) throw new Error('El ID del prompt es obligatorio.');

        if (!agent) throw new Error('El agente del prompt es obligatorio.');

        if (!type) throw new Error('El tipo de prompt es obligatorio.');

        if (!role) throw new Error('El rol del prompt es obligatorio.');

        if (!content)
            throw new Error('El contenido del prompt es obligatorio.');
    }

    getId() {
        return this.id;
    }

    getAgent() {
        return this.agent;
    }

    getType() {
        return this.type;
    }

    getRole(): AgentPromptRole {
        return this.role;
    }

    getContent() {
        return this.content;
    }

    getCreatedAt() {
        return this.createdAt;
    }

    getUpdatedAt() {
        return this.updatedAt;
    }
}
