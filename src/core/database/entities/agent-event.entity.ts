import { ApiProperty } from '@nestjs/swagger';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Index,
} from 'typeorm';

@Entity('agent_events')
@Index(['type'])
@Index(['status'])
@Index(['emitterAgent'])
export class AgentEvent {
    @ApiProperty({ example: 'bbde9314-5011-46e0-aea1-f4bcae91e5c3' })
    @PrimaryGeneratedColumn('uuid')
    readonly id: string;

    @ApiProperty({ required: false, example: '5fc6213a...' })
    @Column({ name: 'session_id', type: 'uuid', nullable: true })
    sessionId?: string;

    @ApiProperty({ example: 'validator_agent' })
    @Column({ name: 'emitter_agent', type: 'varchar', length: 64 })
    emitterAgent: string;

    @ApiProperty({ example: 'validation_error_detected' })
    @Column({ type: 'varchar', length: 64 })
    type: string;

    @ApiProperty({
        type: Object,
        description:
            'Contenido del evento: puede ser prompt, resultado, análisis...',
        example: { text: 'Este texto contiene un error lógico' },
        additionalProperties: true,
    })
    @Column({ type: 'json' })
    payload: Record<string, any>;

    @ApiProperty({ example: 42, required: false })
    @Column({ name: 'response_to_event_id', type: 'int', nullable: true })
    responseToEventId?: number;

    @ApiProperty({
        enum: ['pending', 'processed', 'ignored'],
        example: 'pending',
    })
    @Column({
        type: 'enum',
        enum: ['pending', 'processed', 'ignored'],
        default: 'pending',
    })
    status: 'pending' | 'processed' | 'ignored';

    @ApiProperty({ example: '2025-04-16T23:41:23.430Z' })
    @CreateDateColumn({ name: 'created_at' })
    readonly createdAt: Date;
}
