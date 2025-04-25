import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { AgentFactEntity } from './agent-fact.entity';
import { AgentReasoningEntity } from './agent-reasoning.entity';

/**
 * Representa una verificación factual realizada por el segundo agente (FactChecker).
 */
@Entity('agent_verification')
export class AgentVerificationEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 50 })
    method: string;

    @Column({ type: 'float' })
    confidence: number;

    @Column({ type: 'json' })
    sourcesRetrieved: string[];

    @Column({ type: 'json' })
    sourcesUsed: string[];

    @Column({ type: 'boolean', default: false })
    isOutdated: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToOne(
        () => AgentReasoningEntity,
        (reasoning) => reasoning.verification,
        {
            cascade: true,
        },
    )
    @JoinColumn()
    reasoning: AgentReasoningEntity;

    @ManyToOne(() => AgentFactEntity, (fact) => fact.verifications, {
        onDelete: 'CASCADE',
    })
    fact: AgentFactEntity;
}
