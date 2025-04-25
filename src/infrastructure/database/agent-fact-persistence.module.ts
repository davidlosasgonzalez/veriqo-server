import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentFactEntity } from './typeorm/entities/agent-fact.entity';
import { AgentFactRepository } from './typeorm/repositories/agent-fact.repository';
import { AgentFactRepositoryToken } from '@/application/tokens/agent-fact-repository.token';

@Module({
    imports: [TypeOrmModule.forFeature([AgentFactEntity])],
    providers: [
        AgentFactRepository,
        {
            provide: AgentFactRepositoryToken,
            useExisting: AgentFactRepository,
        },
    ],
    exports: [AgentFactRepository],
})
export class AgentFactPersistenceModule {}
