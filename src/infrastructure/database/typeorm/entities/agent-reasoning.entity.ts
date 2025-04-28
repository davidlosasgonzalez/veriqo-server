import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
} from 'typeorm';
import { AgentFactEntity } from './agent-fact.entity';

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
     * Fact asociado que motivó este razonamiento.
     */
    @ManyToOne(() => AgentFactEntity, (fact) => fact.reasonings, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'fact_id' })
    fact: AgentFactEntity;

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
