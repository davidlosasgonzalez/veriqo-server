import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { plainToInstance } from 'class-transformer';

import { GetPromptsQuery } from './get-prompts.query';

import { AgentPromptService } from '@/shared/llm/services/agent-prompt.service';
import { AgentPromptDto } from '@/shared/presentation/dto/agent-prompt.dto';

@QueryHandler(GetPromptsQuery)
export class GetPromptsHandler implements IQueryHandler<GetPromptsQuery> {
    constructor(
        @Inject(AgentPromptService)
        private readonly promptService: AgentPromptService,
    ) {}

    async execute(): Promise<AgentPromptDto[]> {
        const prompts = await this.promptService.findAll();

        return plainToInstance(AgentPromptDto, prompts, {
            excludeExtraneousValues: true,
        });
    }
}
