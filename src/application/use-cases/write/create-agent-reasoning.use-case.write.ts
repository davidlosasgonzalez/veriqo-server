import { Injectable } from '@nestjs/common';
import { AgentReasoning } from '@/domain/entities/agent-reasoning.entity';

/**
 * Caso de uso WRITE para crear un razonamiento asociado a un AgentFact.
 */
@Injectable()
export class CreateAgentReasoningUseCaseWrite {
    /**
     * Crea un AgentReasoning completo.
     *
     * @param input Contenido del razonamiento y su resumen.
     * @returns Razonamiento creado.
     */
    async execute(input: {
        summary: string;
        content: string;
    }): Promise<AgentReasoning> {
        const now = new Date();
        const reasoning = new AgentReasoning();

        reasoning.summary = input.summary;
        reasoning.content = input.content;
        reasoning.createdAt = now;
        reasoning.updatedAt = now;

        return reasoning;
    }
}
