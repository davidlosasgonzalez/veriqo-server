import { ApiProperty } from '@nestjs/swagger';
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('agent_prompts')
export class AgentPrompt {
    @ApiProperty({ example: 'bbde9314-5011-46e0-aea1-f4bcae91e5c3' })
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @ApiProperty({ example: 'mentor_agent' })
    @Column({ name: 'agent' })
    agent: string;

    @ApiProperty({ description: 'Instrucción base del agente' })
    @Column({ name: 'prompt', type: 'text' })
    prompt: string;

    @ApiProperty({
        example: 'inicio',
        description: 'Uso o contexto del prompt',
    })
    @Column({ name: 'purpose', default: 'principal' })
    purpose: string;

    @ApiProperty()
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ApiProperty()
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
