import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { AgentFactEntity } from './agent-fact.entity';
import { AgentFindingSearchContextEntity } from './agent-finding-search-context.entity';

/**
 * Representa un hallazgo del ValidatorAgent sobre un claim detectado en un texto.
 */
@Entity('agent_findings')
export class AgentFindingEntity {
    /**
     * Identificador único del hallazgo.
     */
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * Afirmación (claim) detectada que requiere análisis.
     */
    @Column({ type: 'text' })
    claim: string;

    /**
     * Representación vectorial (embedding) del claim.
     */
    @Column({ type: 'simple-json' })
    embedding: number[];

    /**
     * Motivo por el cual se considera que necesita fact-checking.
     */
    @Column({ name: 'needs_fact_check_reason', type: 'text', nullable: true })
    needsFactCheckReason?: string | null;

    /**
     * Fact relacionado que valida o refuta este hallazgo.
     */
    @ManyToOne(() => AgentFactEntity, (fact) => fact.findings, {
        nullable: false,
    })
    @JoinColumn({ name: 'related_fact_id' })
    relatedFact: AgentFactEntity;

    /**
     * Identificador del fact relacionado.
     */
    @Column({ name: 'related_fact_id' })
    relatedFactId: string;

    /**
     * Contexto de búsqueda asociado al hallazgo.
     */
    @OneToOne(
        () => AgentFindingSearchContextEntity,
        (context) => context.finding,
    )
    searchContext?: AgentFindingSearchContextEntity | null;

    /**
     * Fecha de creación del hallazgo.
     */
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    /**
     * Fecha de última actualización del hallazgo.
     */
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
