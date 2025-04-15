import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { AgentFact } from '@/database/entities/agent-facts.entity';

function normalizeClaim(claim: string): string {
    return claim.trim().toLowerCase();
}

@Injectable()
export class AgentFactService {
    constructor(
        @InjectRepository(AgentFact)
        private readonly factRepo: Repository<AgentFact>,
    ) {}

    async getFactByClaim(claim: string): Promise<AgentFact | null> {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        return this.factRepo.findOne({
            where: {
                claim: normalizeClaim(claim),
                createdAt: MoreThan(oneWeekAgo),
            },
        });
    }

    async saveFact(
        _agent: string, // Ignorado porque no se usa, pero lo dejamos para mantener la firma
        claim: string,
        status: AgentFact['status'],
        sources: string[],
    ): Promise<AgentFact> {
        const normalizedClaim = normalizeClaim(claim);
        const existing = await this.factRepo.findOneBy({
            claim: normalizedClaim,
        });

        if (existing) {
            existing.status = status;
            existing.sources = sources;
            return this.factRepo.save(existing);
        }

        const newFact = this.factRepo.create({
            claim: normalizedClaim,
            status,
            sources,
        });

        return this.factRepo.save(newFact);
    }

    async getAllFacts(): Promise<AgentFact[]> {
        return this.factRepo.find({
            order: { createdAt: 'DESC' },
        });
    }

    async countAllFacts(): Promise<number> {
        return this.factRepo.count();
    }
}
