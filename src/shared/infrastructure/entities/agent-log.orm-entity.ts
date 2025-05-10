import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

import { AgentPromptOrmEntity } from './agent-prompt.orm-entity';

/**
 * Representa un registro de actividad del sistema, incluyendo prompts y resultados de modelos.
 */
@Entity('agent_logs')
export class AgentLogOrmEntity {
    /* Identificador único del log. */
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /* Nombre del agente que generó el log. */
    @Column({ name: 'agent_name', length: 64 })
    agentName: string;

    /* Nombre del modelo usado. */
    @Column({ length: 32 })
    model: string;

    /* Prompt de entrada enviado al modelo. */
    @Column('text', { name: 'input_prompt' })
    inputPrompt: string;

    /* Resultado generado por el modelo. */
    @Column('longtext', { name: 'output_result' })
    outputResult: string;

    /* Tokens de entrada consumidos. */
    @Column('int', { default: 0, name: 'tokens_input' })
    tokensInput: number;

    /* Tokens de salida generados. */
    @Column('int', { default: 0, name: 'tokens_output' })
    tokensOutput: number;

    /* Tiempo total que tardó la operación (en segundos). */
    @Column('float', { name: 'elapsed_time', nullable: true })
    elapsedTime?: number | null;

    /* Prompt asociado a este log (opcional). */
    @ManyToOne(() => AgentPromptOrmEntity, { nullable: true })
    @JoinColumn({ name: 'prompt_id' })
    prompt?: AgentPromptOrmEntity | null;

    /* Fecha de creación del log. */
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
