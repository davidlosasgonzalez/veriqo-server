import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatCompletionMessageParam } from 'openai/resources/chat';
import { Repository } from 'typeorm';
import {
    AgentFinding,
    AgentFindingCategory,
} from '@/database/entities/agent-findings.entity';
import { OpenAIChatService } from '@/shared/ai/openai-chat.service';
import { EventBusService } from '@/shared/events/event-bus.service';
import { FactualCheckRequiredData } from '@/shared/events/payloads/factual-check-required.payload';
import { AgentEventPayload } from '@/shared/events/types/agent-event-payload.type';
import { AgentEventType } from '@/shared/events/types/agent-event-type.enum';
import { AgentLoggerService } from '@/shared/logger/agent-logger.service';
import { AgentPromptService } from '@/shared/prompts/agent-prompt.service';

@Injectable()
export class AgentFindingService {
    constructor(
        @InjectRepository(AgentFinding)
        private readonly findingRepo: Repository<AgentFinding>,
        private readonly openai: OpenAIChatService,
        private readonly promptService: AgentPromptService,
        private readonly logger: AgentLoggerService,
        private readonly eventBus: EventBusService,
    ) {}

    async analyzeText(prompt: string): Promise<AgentFinding[]> {
        const systemPrompt =
            await this.promptService.getPromptForAgent('validator_agent');

        const messages: ChatCompletionMessageParam[] = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
        ];

        const rawResponse = await this.openai.chat(messages, 'gpt-4o');
        await this.logger.logUse(
            'ValidatorAgent',
            'gpt-4o',
            prompt,
            rawResponse,
            0,
            0,
        );

        let parsed: any;
        try {
            parsed = JSON.parse(rawResponse);
        } catch (err) {
            this.logger.error(
                `[AgentFindingService] Error al parsear JSON: ${err}`,
            );
            throw new Error('La respuesta del modelo no es JSON válido.');
        }

        if (!parsed?.data || !Array.isArray(parsed.data)) {
            throw new Error(
                '[AgentFindingService] El JSON no contiene findings válidos.',
            );
        }

        const savedFindings: AgentFinding[] = [];

        for (const item of parsed.data) {
            const needsFactCheck = item.needsFactCheck === true;

            const finding = this.findingRepo.create({
                agent: 'validator_agent',
                claim: item.claim,
                category: item.category as AgentFindingCategory,
                summary: item.summary,
                explanation: item.explanation,
                suggestion: item.suggestion,
                keywords: item.keywords ?? [],
                synonyms: item.synonyms ?? {},
                namedEntities: item.namedEntities ?? [],
                locations: item.locations ?? [],
                siteSuggestions: item.siteSuggestions ?? [],
                searchQuery: item.searchQuery ?? '',
                needsFactCheck,
                needsFactCheckReason: item.needsFactCheckReason ?? '',
            });

            const saved = await this.findingRepo.save(finding);
            savedFindings.push(saved);

            if (needsFactCheck) {
                const payload: AgentEventPayload<FactualCheckRequiredData> = {
                    type: AgentEventType.FACTUAL_CHECK_REQUIRED,
                    sourceAgent: 'ValidatorAgent',
                    data: {
                        claim: item.claim,
                        keywords: item.keywords ?? [],
                        findingId: saved.id,
                        searchQuery: item.searchQuery ?? '',
                    },
                };

                await this.eventBus.emit(payload);
                this.logger.debug(
                    `[AgentFindingService] Evento FACTUAL_CHECK_REQUIRED emitido para: ${item.claim}`,
                );
            }
        }

        return savedFindings;
    }

    async saveFinding(finding: AgentFinding): Promise<AgentFinding> {
        return this.findingRepo.save(finding);
    }

    async getAllFindings(): Promise<AgentFinding[]> {
        return this.findingRepo.find({ order: { createdAt: 'DESC' } });
    }

    async getFindingById(id: string): Promise<AgentFinding | null> {
        return this.findingRepo.findOne({
            where: { id },
        });
    }
}
