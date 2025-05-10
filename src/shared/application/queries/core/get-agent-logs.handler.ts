import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { plainToInstance } from 'class-transformer';

import { GetAgentLogsQuery } from './get-agent-logs.query';

import { AgentLogService } from '@/shared/llm/services/agent-log.service';
import { AgentLogDto } from '@/shared/presentation/dto/agent-log.dto';

@QueryHandler(GetAgentLogsQuery)
export class GetAgentLogsHandler implements IQueryHandler<GetAgentLogsQuery> {
    constructor(
        @Inject(AgentLogService)
        private readonly logService: AgentLogService,
    ) {}

    async execute(): Promise<AgentLogDto[]> {
        const logs = await this.logService.findAll();

        return plainToInstance(AgentLogDto, logs, {
            excludeExtraneousValues: true,
        });
    }
}
