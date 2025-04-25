import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { AgentFindingEntity } from './agent-finding.entity';

/**
 * Contiene la información auxiliar generada por el ValidatorAgent para facilitar búsquedas externas o comparaciones semánticas.
 */
@Entity('agent_finding_search_contexts')
export class AgentFindingSearchContextEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'simple-array' })
    keywords: string[];

    @Column({ type: 'simple-json', nullable: true })
    synonyms?: Record<string, string[]> | null;

    @Column({ type: 'json' })
    searchQuery: Record<string, string>;

    @Column({ type: 'simple-array', nullable: true })
    siteSuggestions?: string[] | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToOne(() => AgentFindingEntity, (finding) => finding.searchContext, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    finding: AgentFindingEntity;
}
