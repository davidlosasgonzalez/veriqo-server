import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

import { FindingOrmEntity } from './finding.orm-entity';

@Entity('finding_search_contexts')
export class FindingSearchContextOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'finding_id' })
    findingId: string;

    @OneToOne(() => FindingOrmEntity, (finding) => finding.searchContext)
    @JoinColumn({ name: 'finding_id' })
    finding: FindingOrmEntity;

    @Column({ name: 'search_query', type: 'json' })
    searchQuery: Record<string, string>;

    @Column({ name: 'site_suggestions', type: 'simple-array', nullable: true })
    siteSuggestions?: string[] | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
