import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoreController } from './controllers/core.controller';

import { FindingOrmEntity } from '@/agents/validator-agent/infrastructure/entities/finding.orm-entity';
import { FindingRepository } from '@/agents/validator-agent/infrastructure/repositories/finding.repository';
import {
    GetAgentLogsHandler,
    GetPromptsHandler,
} from '@/shared/application/queries';
import {
    GetServerMetricsUseCase,
    GetVerificationStatsUseCase,
} from '@/shared/application/use-cases/read';
import { FactOrmEntity } from '@/shared/infrastructure/entities/fact.orm-entity';
import { FactRepository } from '@/shared/infrastructure/repositories/fact.repository';
import { LlmModule } from '@/shared/llm/llm.module';

@Module({
    imports: [
        CqrsModule,
        LlmModule,
        TypeOrmModule.forFeature([FactOrmEntity, FindingOrmEntity]),
    ],
    controllers: [CoreController],
    providers: [
        GetAgentLogsHandler,
        GetPromptsHandler,
        GetVerificationStatsUseCase,
        GetServerMetricsUseCase,
        FactRepository,
        FindingRepository,
    ],
})
export class CoreModule {}
