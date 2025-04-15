import { ApiProperty } from '@nestjs/swagger';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    Index,
} from 'typeorm';

@Index(['agentName'])
@Index(['createdAt'])
@Entity('agent_logs')
export class AgentLog {
    @ApiProperty({ example: 'bbde9314-5011-46e0-aea1-f4bcae91e5c3' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: 'mentor_agent' })
    @Column({ name: 'agent_name', length: 64 })
    agentName: string;

    @ApiProperty({ example: 'gpt-4o' })
    @Column({ length: 32 })
    model: string;

    @ApiProperty({ description: 'Prompt de entrada enviado al agente' })
    @Column('text', { name: 'input_prompt' })
    inputPrompt: string;

    @ApiProperty({ description: 'Respuesta generada por el agente' })
    @Column('longtext', { name: 'output_result' })
    outputResult: string;

    @ApiProperty()
    @Column('int', { default: 0, name: 'tokens_input' })
    tokensInput: number;

    @ApiProperty()
    @Column('int', { default: 0, name: 'tokens_output' })
    tokensOutput: number;

    @ApiProperty()
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
