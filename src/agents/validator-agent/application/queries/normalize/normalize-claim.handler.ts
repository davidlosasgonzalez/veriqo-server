import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { NormalizeClaimsUseCase } from '../../use-cases/read/normalize/normalize-claims.use-case';

import { NormalizeClaimsQuery } from './normalize-claims.query';

import { NormalizedClaim } from '@/shared/domain/value-objects/normalized-claim.vo';

@QueryHandler(NormalizeClaimsQuery)
export class NormalizeClaimsHandler
    implements IQueryHandler<NormalizeClaimsQuery>
{
    constructor(
        private readonly normalizeClaimsUseCase: NormalizeClaimsUseCase,
    ) {}

    async execute(query: NormalizeClaimsQuery): Promise<NormalizedClaim[]> {
        return this.normalizeClaimsUseCase.execute(query);
    }
}
