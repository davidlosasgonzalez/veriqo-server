import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    OneToOne,
    ManyToOne,
} from 'typeorm';
import { AgentFactEntity } from './agent-fact.entity';
import { AgentFindingSearchContextEntity } from './agent-finding-search-context.entity';

/**
 * Representa un hallazgo del ValidatorAgent sobre un claim detectado en un texto.
 */
@Entity('agent_findings')
export class AgentFindingEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    claim: string;

    @Column({ type: 'simple-json' })
    embedding: number[];

    @Column({ type: 'boolean', nullable: true })
    needsFactCheck?: boolean | null;

    @Column({ type: 'text', nullable: true })
    needsFactCheckReason?: string | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => AgentFactEntity, (fact) => fact.findings, {
        nullable: false,
    })
    @JoinColumn({ name: 'relatedFactId' })
    relatedFact: AgentFactEntity;

    @Column()
    relatedFactId: string;

    @OneToOne(
        () => AgentFindingSearchContextEntity,
        (search) => search.finding,
        {
            nullable: true,
        },
    )
    searchContext?: AgentFindingSearchContextEntity | null;
}
