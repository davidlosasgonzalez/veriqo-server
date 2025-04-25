import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { AgentPromptRole } from '@/shared/types/agent-prompt.types';

/**
 * Representa un fragmento de prompt asociado a un agente y una función específica.
 */
@Entity('agent_prompt')
export class AgentPromptEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 50 })
    agent: string;

    @Column({ type: 'varchar', length: 50 })
    type: string;

    @Column({
        type: 'enum',
        enum: AgentPromptRole,
    })
    role: AgentPromptRole;

    @Column('text')
    content: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
