import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentReasoningEntity } from './typeorm/entities/agent-reasoning.entity';
import { AgentReasoningRepository } from './typeorm/repositories/agent-reasoning.repository';
import { AgentReasoningRepositoryToken } from '@/application/tokens/agent-reasoning-repository.token';

/**
 * Módulo de persistencia para la entidad AgentReasoning.
 */
@Module({
    imports: [TypeOrmModule.forFeature([AgentReasoningEntity])],
    providers: [
        {
            provide: AgentReasoningRepositoryToken,
            useClass: AgentReasoningRepository,
        },
    ],
    exports: [AgentReasoningRepositoryToken],
})
export class AgentReasoningPersistenceModule {}
