import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AgentFindingRepositoryToken } from '@/application/tokens/agent-finding-repository.token';
import { AgentFindingEntity } from '@/infrastructure/database/typeorm/entities/agent-finding.entity';
import { AgentFindingRepository } from '@/infrastructure/database/typeorm/repositories/agent-finding.repository';

@Module({
    imports: [TypeOrmModule.forFeature([AgentFindingEntity])],
    providers: [
        AgentFindingRepository,
        {
            provide: AgentFindingRepositoryToken,
            useExisting: AgentFindingRepository,
        },
    ],
    exports: [AgentFindingRepositoryToken],
})
export class AgentFindingPersistenceModule {}
