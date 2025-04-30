import { Injectable } from '@nestjs/common';
import { AgentReasoning } from '@/domain/entities/agent-reasoning.entity';
import { CreateAgentReasoningInput } from '@/shared/interfaces/create-agent-reasoning-input.interface';

/**
 * Caso de uso WRITE para crear un razonamiento asociado a un AgentFact o a una AgentVerification.
 */
@Injectable()
export class CreateAgentReasoningUseCaseWrite {
    /**
     * Crea un AgentReasoning completo.
     *
     * @param input - Contenido del razonamiento, su resumen y relaciones opcionales.
     * @returns Razonamiento creado.
     */
    async execute(input: CreateAgentReasoningInput): Promise<AgentReasoning> {
        const now = new Date();
        const reasoning = new AgentReasoning();

        reasoning.summary = input.summary;
        reasoning.content = input.content;
        reasoning.createdAt = now;
        reasoning.updatedAt = now;

        if (input.factId) {
            reasoning.factId = input.factId;
        }

        if (input.verificationId) {
            reasoning.verificationId = input.verificationId;
        }

        return reasoning;
    }
}
