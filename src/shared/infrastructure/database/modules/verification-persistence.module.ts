import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VerificationOrmEntity } from '../../entities/verification.orm-entity';
import { VerificationRepository } from '../../repositories/verification.repository';

import { VerificationRepositoryToken } from '@/shared/tokens/verification-repository.token';

@Module({
    imports: [TypeOrmModule.forFeature([VerificationOrmEntity])],
    providers: [
        {
            provide: VerificationRepositoryToken,
            useClass: VerificationRepository,
        },
    ],
    exports: [VerificationRepositoryToken],
})
export class VerificationPersistenceModule {}
