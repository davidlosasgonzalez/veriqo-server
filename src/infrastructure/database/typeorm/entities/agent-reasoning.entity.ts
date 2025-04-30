import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { AgentFactEntity } from './agent-fact.entity';
import { AgentVerificationEntity } from './agent-verification.entity';

/**
 * Representa un razonamiento generado por un agente, utilizado para validar una afirmación.
 */
@Entity('agent_reasoning')
export class AgentReasoningEntity {
    /**
     * Identificador único del razonamiento.
     */
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * Resumen breve del razonamiento.
     */
    @Column('text')
    summary: string;

    /**
     * Contenido completo del razonamiento.
     */
    @Column('text')
    content: string;

    /**
     * Verificación que motivó este razonamiento.
     * Solo se establece si el razonamiento fue generado tras una verificación factual externa.
     */
    @OneToOne(
        () => AgentVerificationEntity,
        (verification) => verification.reasoning,
        { onDelete: 'CASCADE', nullable: true },
    )
    @JoinColumn({ name: 'verification_id' })
    verification: AgentVerificationEntity | null;

    /**
     * Fact al que pertenece este razonamiento.
     * Se usa cuando el razonamiento fue generado directamente por el agente validador sin intervención externa.
     */
    @ManyToOne(() => AgentFactEntity, (fact) => fact.reasonings, {
        onDelete: 'CASCADE',
        nullable: true,
    })
    @JoinColumn({ name: 'fact_id' })
    fact: AgentFactEntity | null;

    /**
     * Fecha de creación del razonamiento.
     */
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    /**
     * Fecha de última actualización del razonamiento.
     */
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
