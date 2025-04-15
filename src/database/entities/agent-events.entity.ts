import { ApiProperty } from '@nestjs/swagger';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Index,
} from 'typeorm';

@Index(['type'])
@Index(['status'])
@Index(['emitterAgent'])
@Entity('agent_events')
export class AgentEvent {
    @ApiProperty({ example: 'bbde9314-5011-46e0-aea1-f4bcae91e5c3' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ required: false, example: '5fc6213a...' })
    @Column({ name: 'session_id', nullable: true })
    sessionId?: string;

    @ApiProperty({ example: 'validator_agent' })
    @Column({ name: 'emitter_agent' })
    emitterAgent: string;

    @ApiProperty({ example: 'validation_error_detected' })
    @Column()
    type: string;

    @ApiProperty({
        type: 'object',
        description:
            'Contenido del evento: puede ser prompt, resultado, análisis...',
        example: { text: 'Este texto contiene un error lógico' },
        additionalProperties: true,
    })
    @Column({ type: 'json' })
    payload: Record<string, any>;

    @ApiProperty({ example: 42, required: false })
    @Column({ name: 'response_to_event_id', nullable: true })
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

    @ApiProperty()
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
