import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum AgentFindingCategory {
    FACTUAL_ERROR = 'factual_error',
    REASONING = 'reasoning',
    CONTRADICTION = 'contradiction',
    AMBIGUITY = 'ambiguity',
    STYLE = 'style',
    OTHER = 'other',
}

@Entity('agent_findings')
@Index(['agent', 'claim'])
export class AgentFinding {
    @ApiProperty({ example: 'bbde9314-5011-46e0-aea1-f4bcae91e5c3' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: 'validator_agent' })
    @Column({ type: 'varchar', length: 64 })
    agent: string;

    @ApiProperty({ example: 'Pedro Gómez fue astronauta de la NASA.' })
    @Column({ type: 'varchar', length: 512 })
    claim: string;

    @ApiProperty({ enum: AgentFindingCategory })
    @Column({ type: 'enum', enum: AgentFindingCategory })
    category: AgentFindingCategory;

    @ApiProperty()
    @Column({ type: 'text' })
    summary: string;

    @ApiProperty()
    @Column({ type: 'text' })
    explanation: string;

    @ApiProperty()
    @Column({ type: 'text' })
    suggestion: string;

    @ApiProperty({ type: [String] })
    @Column('simple-array', { name: 'keywords', nullable: true })
    keywords?: string[];

    @ApiProperty({ type: Object, example: { perfil: ['cuenta', 'usuario'] } })
    @Column({ type: 'json', name: 'synonyms', nullable: true })
    synonyms?: Record<string, string[]>;

    @ApiProperty({ type: [String] })
    @Column('simple-array', { name: 'named_entities', nullable: true })
    namedEntities?: string[];

    @ApiProperty({ type: [String] })
    @Column('simple-array', { name: 'locations', nullable: true })
    locations?: string[];

    @ApiProperty({ example: '"Pedro Gómez" astronauta NASA' })
    @Column({ type: 'text', name: 'search_query', nullable: true })
    searchQuery?: string;

    @ApiProperty()
    @Column({ type: 'boolean', name: 'needs_fact_check', default: false })
    needsFactCheck: boolean;

    @ApiPropertyOptional()
    @Column({ type: 'text', name: 'needs_fact_check_reason', nullable: true })
    needsFactCheckReason?: string;

    @ApiPropertyOptional({ type: [String] })
    @Column('simple-array', { name: 'site_suggestions', nullable: true })
    siteSuggestions?: string[];

    @ApiProperty()
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ApiProperty()
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
