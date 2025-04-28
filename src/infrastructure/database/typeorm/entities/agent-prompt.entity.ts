import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { AgentPromptRole } from '@/shared/types/parsed-types/agent-prompt.types';

/**
 * Representa un fragmento de prompt asociado a un agente y una función específica.
 */
@Entity('agent_prompt')
export class AgentPromptEntity {
    /**
     * Identificador único del prompt.
     */
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * Nombre del agente al que pertenece este prompt.
     */
    @Column({ type: 'varchar', length: 50 })
    agent: string;

    /**
     * Tipo de funcionalidad o acción a la que está asociado el prompt.
     */
    @Column({ type: 'varchar', length: 50 })
    type: string;

    /**
     * Rol que representa el origen del fragmento (system, user, etc.).
     */
    @Column({
        type: 'enum',
        enum: AgentPromptRole,
    })
    role: AgentPromptRole;

    /**
     * Contenido textual del prompt.
     */
    @Column('text')
    content: string;

    /**
     * Fecha de creación del registro.
     */
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    /**
     * Fecha de última actualización del registro.
     */
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
