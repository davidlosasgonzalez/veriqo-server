import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { AgentLogEntity } from './agent-log.entity';
import { AgentPromptRole } from '@/shared/types/enums/agent-prompt.types';

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
     * Logs asociados a este prompt (opcional).
     */
    @OneToMany(() => AgentLogEntity, (log) => log.prompt)
    logs: AgentLogEntity[];

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
