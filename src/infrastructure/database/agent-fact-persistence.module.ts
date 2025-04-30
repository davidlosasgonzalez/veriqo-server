import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentFactEntity } from './typeorm/entities/agent-fact.entity';
import { AgentFactRepository } from './typeorm/repositories/agent-fact.repository';
import { AgentFactRepositoryToken } from '@/application/tokens/agent-fact-repository.token';

/**
 * Módulo de persistencia para la entidad AgentFact.
 */
@Module({
    imports: [TypeOrmModule.forFeature([AgentFactEntity])],
    providers: [
        {
            provide: AgentFactRepositoryToken,
            useClass: AgentFactRepository,
        },
    ],
    exports: [AgentFactRepositoryToken],
})
export class AgentFactPersistenceModule {}
