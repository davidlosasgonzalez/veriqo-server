import { ApiProperty } from '@nestjs/swagger';
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';

@Entity('agent_prompts')
export class AgentPrompt {
    @ApiProperty({ example: 'bbde9314-5011-46e0-aea1-f4bcae91e5c3' })
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    readonly id: string;

    @ApiProperty({ example: 'validator_agent' })
    @Column({ name: 'agent', type: 'varchar', length: 64 })
    agent: string;

    @ApiProperty({
        example: 'VALIDATOR_ANALYZE_MULTICLAIM',
        description:
            'Clave única para identificar el tipo de prompt dentro del agente.',
    })
    @Index()
    @Column({ name: 'key', type: 'varchar', length: 64 })
    key: string;

    @ApiProperty({ description: 'Instrucción base del agente.' })
    @Column({ name: 'prompt', type: 'text' })
    prompt: string;

    @ApiProperty({
        example: 'principal',
        description:
            'Propósito o contexto del prompt (por ejemplo: inicio, fallback, refuerzo).',
    })
    @Column({
        name: 'purpose',
        type: 'varchar',
        length: 32,
        default: 'principal',
    })
    purpose: string;

    @ApiProperty({ example: '2025-04-16T23:41:23.430Z' })
    @CreateDateColumn({ name: 'created_at' })
    readonly createdAt: Date;

    @ApiProperty({ example: '2025-04-16T23:41:23.430Z' })
    @UpdateDateColumn({ name: 'updated_at' })
    readonly updatedAt: Date;
}
