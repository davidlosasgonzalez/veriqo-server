import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

import { FindingSearchContextOrmEntity } from './finding-search-context.orm-entity';

import { FactOrmEntity } from '@/shared/infrastructure/entities/fact.orm-entity';

@Entity('findings')
export class FindingOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    claim: string;

    @Column({ type: 'simple-json' })
    embedding: number[];

    @Column({ name: 'needs_fact_check_reason', type: 'text', nullable: true })
    needsFactCheckReason?: string | null;

    @ManyToOne(() => FactOrmEntity, (fact) => fact.findings)
    @JoinColumn({ name: 'related_fact_id' })
    relatedFact: FactOrmEntity;

    @Column({ name: 'related_fact_id' })
    relatedFactId: string;

    @OneToOne(() => FindingSearchContextOrmEntity, (ctx) => ctx.finding, {
        cascade: true,
        nullable: true,
    })
    searchContext?: FindingSearchContextOrmEntity | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
