import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { GetVerificationByIdQuery } from '@/shared/application/queries/verification/get-verification-by-id.query';
import { Verification } from '@/shared/domain/entities/verification';
import { IVerificationRepository } from '@/shared/domain/interfaces/verification-repository.interface';
import { VerificationRepositoryToken } from '@/shared/tokens/verification-repository.token';

@Injectable()
export class GetVerificationByIdUseCase {
    constructor(
        @Inject(VerificationRepositoryToken)
        private readonly verificationRepository: IVerificationRepository,
    ) {}

    async execute(query: GetVerificationByIdQuery): Promise<Verification> {
        const verification = await this.verificationRepository.findById(
            query.payload.id,
        );

        if (!verification) {
            throw new NotFoundException(
                `No se encontró ninguna verificación con ID ${query.payload.id}`,
            );
        }

        return verification;
    }
}
