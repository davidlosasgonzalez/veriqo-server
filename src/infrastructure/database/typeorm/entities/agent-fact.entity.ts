import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { AgentFindingEntity } from './agent-finding.entity';
import { AgentReasoningEntity } from './agent-reasoning.entity';
import { AgentVerificationEntity } from './agent-verification.entity';
import {
    AgentFactCategory,
    AgentFactStatus,
} from '@/shared/types/agent-fact.types';

/**
 * Representa un hecho verificado por el sistema, ya sea internamente o mediante el agente factual.
 */
@Entity('agent_facts')
export class AgentFactEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: AgentFactStatus,
    })
    status: AgentFactStatus;

    @Column({
        type: 'enum',
        enum: AgentFactCategory,
        nullable: true,
    })
    category: AgentFactCategory | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToOne(() => AgentReasoningEntity, (reasoning) => reasoning.fact, {
        nullable: true,
        cascade: true,
    })
    @JoinColumn()
    reasoning?: AgentReasoningEntity | null;

    @OneToMany(() => AgentFindingEntity, (finding) => finding.relatedFact)
    findings: AgentFindingEntity[];

    @OneToMany(
        () => AgentVerificationEntity,
        (verification) => verification.fact,
        {
            nullable: true,
        },
    )
    verifications?: AgentVerificationEntity[] | null;
}
