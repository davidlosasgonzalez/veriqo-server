import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentSource } from '@/database/entities/agent-sources.entity';
import { AgentVerification } from '@/database/entities/agent-verifications.entity';
import { VerificationVerdict } from '@/shared/types/verification-verdict.type';

@Injectable()
export class AgentVerificationService {
    constructor(
        @InjectRepository(AgentVerification)
        private readonly verificationRepo: Repository<AgentVerification>,
        @InjectRepository(AgentSource)
        private readonly sourceRepo: Repository<AgentSource>,
    ) {}

    async saveVerification(
        agent: string,
        claim: string,
        result: AgentVerification['result'],
        reasoning: string,
        sources: {
            url: string;
            domain: string;
            snippet?: string;
        }[],
        sourcesRetrieved: string[],
        sourcesUsed: string[],
        findingId?: string,
    ): Promise<AgentVerification> {
        const verification = this.verificationRepo.create({
            agent,
            claim,
            result,
            reasoning,
            sourcesRetrieved: sourcesRetrieved,
            sourcesUsed: sourcesUsed,
            findingId,
        });

        const savedVerification =
            await this.verificationRepo.save(verification);

        const sourceEntities = sources.map((source) =>
            this.sourceRepo.create({
                agent,
                claim,
                url: source.url,
                domain: source.domain,
                snippet: source.snippet ?? null,
                verification: savedVerification,
            }),
        );

        await this.sourceRepo.save(sourceEntities);

        return savedVerification;
    }

    async getVerificationByClaim(
        claim: string,
    ): Promise<AgentVerification | null> {
        return this.verificationRepo.findOne({
            where: { claim },
            relations: ['sources'],
        });
    }

    async countByVerdict(): Promise<Record<VerificationVerdict, number>> {
        const result = await this.verificationRepo
            .createQueryBuilder('v')
            .select('v.result', 'result')
            .addSelect('COUNT(*)', 'count')
            .groupBy('v.result')
            .getRawMany();

        return result.reduce(
            (acc, curr) => {
                acc[curr.result as VerificationVerdict] = Number(curr.count);
                return acc;
            },
            {} as Record<VerificationVerdict, number>,
        );
    }

    async getAllSources(): Promise<AgentSource[]> {
        return this.sourceRepo.find({
            relations: ['verification'],
            order: { createdAt: 'DESC' },
        });
    }

    async getAllVerifications(): Promise<AgentVerification[]> {
        return this.verificationRepo.find({
            order: { createdAt: 'DESC' },
        });
    }
}
