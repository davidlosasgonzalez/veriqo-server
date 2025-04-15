import { Injectable, Logger } from '@nestjs/common';
import {
    AgentFinding,
    AgentFindingCategory,
} from '@/database/entities/agent-findings.entity';
import { EventBusService } from '@/shared/events/event-bus.service';
import { FactualCheckRequiredData } from '@/shared/events/payloads/factual-check-required.payload';
import { AgentEventPayload } from '@/shared/events/types/agent-event-payload.type';
import { AgentEventType } from '@/shared/events/types/agent-event-type.enum';
import { AgentFindingService } from '@/shared/facts/agent-finding.service';
import { ValidationFinding } from '@/shared/types/validation-finding.type';
import { buildSearchQueryFromValidatedData } from '@/shared/utils/generate-search-query';

@Injectable()
export class ValidatorAgentService {
    private readonly logger = new Logger(ValidatorAgentService.name);

    constructor(
        private readonly agentFindingService: AgentFindingService,
        private readonly eventBusService: EventBusService,
    ) {}

    async execute(prompt: string): Promise<ValidationFinding[]> {
        const findings: AgentFinding[] =
            await this.agentFindingService.analyzeText(prompt);
        const result: ValidationFinding[] = [];

        for (const finding of findings) {
            const validCategories = Object.values(AgentFindingCategory);
            if (!validCategories.includes(finding.category)) {
                this.logger.warn(
                    `[ValidatorAgent] Categoría inválida: "${finding.category}", usando 'other'.`,
                );
                finding.category = AgentFindingCategory.OTHER;
            }

            const keywords: string[] = finding.keywords ?? [];
            const synonymsMap = finding.synonyms ?? {};
            const flatSynonyms = Object.values(synonymsMap).flat();
            const searchQuery = finding.searchQuery?.trim().length
                ? finding.searchQuery
                : buildSearchQueryFromValidatedData(
                      finding.claim,
                      keywords,
                      synonymsMap,
                      finding.siteSuggestions ?? [],
                  );

            finding.searchQuery = searchQuery;

            const needsFactCheck: boolean = finding.needsFactCheck === true;

            if (needsFactCheck) {
                const payload: AgentEventPayload<FactualCheckRequiredData> = {
                    type: AgentEventType.FACTUAL_CHECK_REQUIRED,
                    sourceAgent: 'ValidatorAgent',
                    data: {
                        claim: finding.claim,
                        keywords,
                        findingId: finding.id,
                        searchQuery,
                    },
                };

                await this.eventBusService.emit(payload);
                this.logger.debug(
                    `[ValidatorAgent] Emitted FACTUAL_CHECK_REQUIRED for claim: "${finding.claim}"`,
                );
            } else {
                this.logger.debug(
                    `[ValidatorAgent] No fact check needed for claim: "${finding.claim}"`,
                );
            }

            result.push({
                id: String(finding.id),
                claim: finding.claim,
                category: finding.category,
                summary: finding.summary ?? '',
                explanation: finding.explanation ?? '',
                suggestion: finding.suggestion ?? '',
                keywords,
                synonyms: synonymsMap,
                needsFactCheck,
                searchQuery,
                namedEntities: finding.namedEntities ?? [],
                locations: finding.locations ?? [],
                siteSuggestions: finding.siteSuggestions ?? [],
                needsFactCheckReason: finding.needsFactCheckReason ?? '',
            });
        }

        return result;
    }

    async getFindingById(id: string): Promise<ValidationFinding | null> {
        const entity = await this.agentFindingService.getFindingById(id);
        if (!entity) return null;

        return {
            id: entity.id,
            claim: entity.claim,
            category: entity.category,
            summary: entity.summary ?? '',
            explanation: entity.explanation ?? '',
            suggestion: entity.suggestion ?? '',
            keywords: entity.keywords ?? [],
            synonyms: entity.synonyms ?? {},
            needsFactCheck: entity.needsFactCheck ?? false,
            searchQuery: entity.searchQuery ?? '',
            namedEntities: entity.namedEntities ?? [],
            locations: entity.locations ?? [],
        };
    }

    async getAllFindings(): Promise<AgentFinding[]> {
        return this.agentFindingService.getAllFindings();
    }
}
