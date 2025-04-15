import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    Index,
    OneToMany,
} from 'typeorm';
import { AgentSource } from './agent-sources.entity';

@Entity('agent_verifications')
@Index(['claim'])
export class AgentVerification {
    @ApiProperty({ example: 'bbde9314-5011-46e0-aea1-f4bcae91e5c3' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiPropertyOptional({ example: 'd4d260a4-9180-4532-ae0c-7305babc6b0f' })
    @Column({ name: 'finding_id', type: 'uuid', nullable: true })
    findingId?: string;

    @ApiProperty({ example: 'fact_checker_agent' })
    @Column()
    agent: string;

    @ApiProperty({
        example: 'David Losas Gonzalez es programador.',
        description: 'Afirmación validada con razonamiento por un modelo IA.',
    })
    @Column({ type: 'varchar', length: 512 })
    claim: string;

    @ApiProperty({
        example: 'true',
        enum: ['true', 'possibly_true', 'false', 'unknown'],
    })
    @Column({
        type: 'enum',
        enum: ['true', 'possibly_true', 'false', 'unknown'],
        default: 'unknown',
    })
    result: 'true' | 'possibly_true' | 'false' | 'unknown';

    @ApiProperty({
        description:
            'Explicación dada por el modelo para justificar la veracidad.',
        example: 'La afirmación coincide con resultados en LinkedIn y GitHub.',
    })
    @Column('text')
    reasoning: string;

    @ApiProperty({
        type: [String],
        example: ['https://example.com/a', 'https://example.com/b'],
        description: 'Fuentes obtenidas inicialmente desde Brave.',
    })
    @Column('simple-array', { name: 'sources_retrieved' })
    sourcesRetrieved: string[];

    @ApiProperty({
        type: [String],
        example: ['https://example.com/a'],
        description:
            'Fuentes realmente utilizadas por la IA en su razonamiento.',
    })
    @Column('simple-array', { name: 'sources_used' })
    sourcesUsed: string[];

    @ApiProperty({ type: () => [AgentSource] })
    @OneToMany(() => AgentSource, (s) => s.verification)
    sources: AgentSource[];

    @ApiProperty()
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ApiProperty()
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
