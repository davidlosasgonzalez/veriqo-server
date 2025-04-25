import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { AgentFactEntity } from './agent-fact.entity';
import { AgentVerificationEntity } from './agent-verification.entity';

/**
 * Representa un razonamiento generado por un agente, utilizado para validar una afirmación.
 */
@Entity('agent_reasoning')
export class AgentReasoningEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    summary: string;

    @Column('text')
    content: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @JoinColumn()
    fact: AgentFactEntity;

    @ManyToOne(
        () => AgentVerificationEntity,
        (verification) => verification.reasoning,
        { nullable: true },
    )
    verification?: AgentVerificationEntity | null;
}
