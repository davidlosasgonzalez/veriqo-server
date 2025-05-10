import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { AgentLogOrmEntity } from './agent-log.orm-entity';

import {
    AGENT_PROMPT_ROLE,
    type AgentPromptRole,
} from '@/shared/domain/enums/agent-prompt-role.enum';

/**
 * Representa un fragmento de prompt asociado a un agente y una función específica.
 */
@Entity('agent_prompt')
export class AgentPromptOrmEntity {
    /* Identificador único del prompt. */
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /* Nombre del agente al que pertenece este prompt. */
    @Column({ type: 'varchar', length: 50 })
    agent: string;

    /* Tipo de funcionalidad o acción a la que está asociado el prompt. */
    @Column({ type: 'varchar', length: 50 })
    type: string;

    /* Rol que representa el origen del fragmento (system, user, etc.). */
    @Column({
        type: 'enum',
        enum: AGENT_PROMPT_ROLE,
    })
    role: AgentPromptRole;

    /* Contenido textual del prompt. */
    @Column('text')
    content: string;

    /* Logs asociados a este prompt (opcional). */
    @OneToMany(() => AgentLogOrmEntity, (log) => log.prompt)
    logs: AgentLogOrmEntity[];

    /* Fecha de creación del registro. */
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    /* Fecha de última actualización del registro. */
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
