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
import { AgentReasoningEntity } from './agent-reasoning.entity';
import { SearchEngineUsed } from '@/shared/types/enums/search-engine-used.enum';

/**
 * Representa una verificación factual realizada por el segundo agente (FactChecker).
 */
@Entity('agent_verification')
export class AgentVerificationEntity {
    /**
     * Identificador único de la verificación.
     */
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * Motor de búsqueda utilizado para la verificación.
     */
    @Column({
        name: 'engine_used',
        type: 'enum',
        enum: SearchEngineUsed,
        nullable: true,
    })
    engineUsed: SearchEngineUsed | null;

    /**
     * Nivel de confianza de la verificación.
     */
    @Column({ type: 'float', nullable: true })
    confidence: number | null;

    /**
     * Fuentes recuperadas durante la verificación.
     */
    @Column({ name: 'sources_retrieved', type: 'json' })
    sourcesRetrieved: string[];

    /**
     * Fuentes utilizadas efectivamente en la verificación.
     */
    @Column({ name: 'sources_used', type: 'json' })
    sourcesUsed: string[];

    /**
     * Indica si la verificación está desactualizada.
     */
    @Column({ name: 'is_outdated', type: 'boolean', default: false })
    isOutdated: boolean;

    /**
     * Razonamiento asociado a la verificación.
     */
    @OneToOne(() => AgentReasoningEntity, { cascade: true, nullable: true })
    @JoinColumn({ name: 'reasoning_id' })
    reasoning: AgentReasoningEntity | null;

    /**
     * Fact al que pertenece esta verificación.
     */
    @ManyToOne(() => AgentFactEntity, (fact) => fact.verifications, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'fact_id' })
    fact: AgentFactEntity;

    /**
     * Fecha de creación de la verificación.
     */
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    /**
     * Fecha de última actualización de la verificación.
     */
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
