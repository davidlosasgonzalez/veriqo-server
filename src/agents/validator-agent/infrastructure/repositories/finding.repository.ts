import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Fact } from '../../../../shared/domain/entities/fact';
import { Finding } from '../../domain/entities/finding';
import { FindingSearchContext } from '../../domain/entities/finding-search-context';
import { ClaimText } from '../../domain/value-objects/claim-text.vo';
import { FindingOrmEntity } from '../entities/finding.orm-entity';

import { IFindingRepository } from '@/shared/domain/interfaces/finding-repository.interface';
import { cosineSimilarity } from '@/shared/utils/math/cosine-similarity';

@Injectable()
export class FindingRepository implements IFindingRepository {
    constructor(
        @InjectRepository(FindingOrmEntity)
        private readonly repo: Repository<FindingOrmEntity>,
    ) {}

    async save(finding: Finding): Promise<Finding> {
        const entity = this.toOrm(finding);
        const saved = await this.repo.save(entity);

        return this.toDomain(saved);
    }

    async saveMany(findings: Finding[]): Promise<void> {
        const entities = findings.map(this.toOrm);

        await this.repo.save(entities);
    }

    async findById(id: string): Promise<Finding | null> {
        const found = await this.repo.findOne({
            where: { id },
            relations: [
                'relatedFact',
                'relatedFact.verifications',
                'relatedFact.verifications.reasoning',
                'searchContext',
                'searchContext.finding',
            ],
        });

        return found ? this.toDomain(found) : null;
    }

    async findAll(): Promise<Finding[]> {
        const all = await this.repo.find({
            relations: ['relatedFact', 'searchContext'],
        });

        return all.map(this.toDomain);
    }

    async findByClaim(claim: string): Promise<Finding | null> {
        const found = await this.repo.findOne({
            where: { claim },
            relations: [
                'relatedFact',
                'relatedFact.verifications',
                'relatedFact.verifications.reasoning',
                'searchContext',
                'searchContext.finding',
            ],
        });

        return found ? this.toDomain(found) : null;
    }

    async findMostSimilarEmbedding(
        vector: number[],
        threshold: number,
    ): Promise<Finding | null> {
        const candidates = await this.repo.find({ relations: ['relatedFact'] });
        let bestMatch: FindingOrmEntity | null = null;
        let bestScore = -Infinity;

        for (const candidate of candidates) {
            const sim = cosineSimilarity(candidate.embedding, vector);

            if (sim >= threshold && sim > bestScore) {
                bestScore = sim;
                bestMatch = candidate;
            }
        }

        return bestMatch ? this.toDomain(bestMatch) : null;
    }

    private toOrm(domain: Finding): FindingOrmEntity {
        const entity = new FindingOrmEntity();

        entity.id = domain.getId();
        entity.claim = domain.getClaim().getValue();
        entity.embedding = domain.getEmbedding();
        entity.needsFactCheckReason = domain.getNeedsFactCheckReason() ?? null;
        entity.createdAt = domain.getCreatedAt();
        entity.updatedAt = domain.getUpdatedAt();
        entity.relatedFactId = domain.getFact()?.getId() ?? null;

        return entity;
    }

    private toDomain(entity: FindingOrmEntity): Finding {
        return new Finding(
            entity.id,
            new ClaimText(entity.claim),
            entity.embedding,
            entity.createdAt,
            entity.updatedAt,
            new Fact(
                entity.relatedFact?.id ?? '',
                entity.relatedFact?.status ?? 'fact_checking',
                entity.relatedFact?.category ?? 'factual',
                entity.relatedFact?.createdAt ?? new Date(),
                entity.relatedFact?.updatedAt ?? new Date(),
            ),
            entity.needsFactCheckReason,
            entity.searchContext
                ? new FindingSearchContext(
                      entity.searchContext.id,
                      entity.searchContext.searchQuery,
                      entity.searchContext.createdAt,
                      entity.searchContext.updatedAt,
                      entity.searchContext.finding?.id,
                      entity.searchContext.siteSuggestions,
                  )
                : null,
        );
    }
}
