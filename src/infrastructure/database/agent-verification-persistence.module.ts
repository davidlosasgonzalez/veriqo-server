import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentVerificationRepositoryToken } from '@/application/tokens/agent-verification-repository.token';
import { AgentVerificationEntity } from '@/infrastructure/database/typeorm/entities/agent-verification.entity';
import { AgentVerificationRepository } from '@/infrastructure/database/typeorm/repositories/agent-verification.repository';

/**
 * Módulo de persistencia para la entidad AgentVerification.
 */
@Module({
    imports: [TypeOrmModule.forFeature([AgentVerificationEntity])],
    providers: [
        {
            provide: AgentVerificationRepositoryToken,
            useClass: AgentVerificationRepository,
        },
    ],
    exports: [AgentVerificationRepositoryToken],
})
export class AgentVerificationPersistenceModule {}
