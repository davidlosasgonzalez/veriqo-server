import { Module } from '@nestjs/common';
import { CoreController } from './core.controller';
import { CoreService } from './core.service';
import { AgentFactRepository } from '@/infrastructure/database/typeorm/repositories/agent-fact.repository';
import { AgentFindingRepository } from '@/infrastructure/database/typeorm/repositories/agent-finding.repository';
import { LlmModule } from '@/shared/llm/llm.module';
import { AgentPromptService } from '@/shared/llm/services/agent-prompt.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentFindingEntity } from '@/infrastructure/database/typeorm/entities/agent-finding.entity';
import { AgentFactEntity } from '@/infrastructure/database/typeorm/entities/agent-fact.entity';

/**
 * Módulo Core que proporciona endpoints de diagnóstico, métricas y configuración general.
 */
@Module({
    imports: [
        LlmModule,
        TypeOrmModule.forFeature([AgentFindingEntity, AgentFactEntity]),
    ],
    controllers: [CoreController],
    providers: [CoreService, AgentFindingRepository, AgentFactRepository],
})
export class CoreModule {}
