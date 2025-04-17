import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentPrompt } from '@/core/database/entities/agent-prompt.entity';
import { ClaudeChatService } from '@/shared/llm/claude-chat.service';
import { ensureValidEmbedding } from '@/shared/utils/embeddings/ensure-valid-embedding';

/**
 * Servicio que genera embeddings mediante Claude a través de un prompt personalizado.
 */
@Injectable()
export class ClaudeEmbeddingService {
    constructor(
        private readonly claude: ClaudeChatService,
        @InjectRepository(AgentPrompt)
        private readonly promptRepo: Repository<AgentPrompt>,
    ) {}

    /**
     * Genera un embedding numérico para el texto indicado usando un prompt Claude.
     *
     * @param text Texto a convertir
     * @returns Vector de embedding válido
     */
    async getEmbedding(text: string): Promise<number[]> {
        const prompt = await this.promptRepo.findOneBy({
            agent: 'embedding_service',
        });

        if (!prompt) {
            throw new Error('No se encontró el prompt para embedding_service.');
        }

        const systemPrompt = prompt.prompt;
        const userPrompt = `Convierte esta afirmación en un embedding numérico:\n"""\n${text}\n"""`;

        const generateEmbedding = async (): Promise<unknown> => {
            const response = await this.claude.chat([
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ]);
            return JSON.parse(response);
        };

        return ensureValidEmbedding(
            await generateEmbedding(),
            generateEmbedding,
        );
    }
}
