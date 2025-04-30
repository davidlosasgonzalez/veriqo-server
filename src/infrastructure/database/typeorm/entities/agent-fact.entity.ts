import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { AgentFindingEntity } from './agent-finding.entity';
import { AgentReasoningEntity } from './agent-reasoning.entity';
import { AgentVerificationEntity } from './agent-verification.entity';
import {
    AgentFactCategory,
    AgentFactStatus,
} from '@/shared/types/enums/agent-fact.types';

/**
 * Representa un hecho verificado por el sistema, ya sea internamente o mediante el agente factual.
 */
@Entity('agent_facts')
export class AgentFactEntity {
    /**
     * Identificador único del fact.
     */
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * Estado actual del fact: validated, rejected o fact_checking.
     */
    @Column({ type: 'enum', enum: AgentFactStatus })
    status: AgentFactStatus;

    /**
     * Categoría semántica del fact: factual, opinion o other.
     */
    @Column({ type: 'enum', enum: AgentFactCategory, nullable: true })
    category: AgentFactCategory;

    /**
     * Hallazgos (findings) que han dado lugar a este fact.
     */
    @OneToMany(() => AgentFindingEntity, (finding) => finding.relatedFact)
    findings: AgentFindingEntity[];

    /**
     * Verificaciones externas asociadas a este fact.
     */
    @OneToMany(
        () => AgentVerificationEntity,
        (verification) => verification.fact,
    )
    verifications: AgentVerificationEntity[];

    /**
     * Razonamientos generados directamente por este fact, sin intervención de una verificación externa.
     */
    @OneToMany(() => AgentReasoningEntity, (reasoning) => reasoning.fact)
    reasonings: AgentReasoningEntity[];

    /**
     * Fecha de creación del fact.
     */
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    /**
     * Fecha de última actualización del fact.
     */
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
