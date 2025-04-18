import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { AgentFact } from './agent-fact.entity';
import { ValidationFindingDto } from '@/agents/validator-agent/dto/validation-finding.dto';

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
@Index(['normalizedClaim'])
export class AgentFinding {
    @ApiProperty({ example: 'bbde9314-5011-46e0-aea1-f4bcae91e5c3' })
    @PrimaryGeneratedColumn('uuid')
    readonly id: string;

    @ApiPropertyOptional({
        description:
            'ID del AgentFact equivalente verificado previamente (si existe).',
        example: '066db72b-f469-4e4e-b932-bfb86f5b8a6e',
    })
    @Column({ type: 'uuid', nullable: true })
    relatedFactId?: string;

    @ManyToOne(() => AgentFact, { nullable: true })
    @JoinColumn({ name: 'relatedFactId' })
    relatedFact?: AgentFact;

    @ApiProperty({ example: 'validator_agent' })
    @Column({ type: 'varchar', length: 64 })
    agent: string;

    @ApiProperty({ example: 'Pedro Gómez fue astronauta de la NASA.' })
    @Column({ type: 'varchar', length: 512 })
    claim: string;

    @ApiProperty({
        description:
            'Versión normalizada del claim para comparación semántica.',
        example: 'pedro gómez astronauta nasa',
    })
    @Index('IDX_agent_finding_normalized_claim')
    @Column({
        type: 'varchar',
        length: 255,
        name: 'normalized_claim',
        nullable: true,
    })
    normalizedClaim?: string;

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

    @ApiPropertyOptional({ type: [String] })
    @Column('json', { name: 'named_entities', nullable: true })
    namedEntities?: string[];

    @ApiPropertyOptional({
        type: Object,
        description: 'Diccionario de sinónimos agrupados por término.',
        example: { Newton: ['Isaac Newton', 'Sir Isaac Newton'] },
        additionalProperties: { type: 'array', items: { type: 'string' } },
    })
    @Column('json', { name: 'synonyms', nullable: true })
    synonyms?: Record<string, string[]>;

    @ApiPropertyOptional({ type: [String] })
    @Column('json', { name: 'locations', nullable: true })
    locations?: string[];

    @ApiPropertyOptional({ type: [String] })
    @Column('json', { name: 'site_suggestions', nullable: true })
    siteSuggestions?: string[];

    @ApiPropertyOptional({ type: String })
    @Column('varchar', { name: 'search_query', length: 512, nullable: true })
    searchQuery?: string;

    @ApiProperty()
    @Column({ name: 'needs_fact_check', type: 'boolean', default: true })
    needsFactCheck: boolean;

    @ApiPropertyOptional()
    @Column({ name: 'needs_fact_check_reason', type: 'text', nullable: true })
    needsFactCheckReason?: string;

    @ApiProperty({ example: '2025-04-16T23:41:23.430Z' })
    @CreateDateColumn({ name: 'created_at' })
    readonly createdAt: Date;

    @ApiProperty({ example: '2025-04-16T23:41:23.430Z' })
    @UpdateDateColumn({ name: 'updated_at' })
    readonly updatedAt: Date;

    /**
     * Convierte la entidad AgentFinding a su DTO correspondiente.
     * @returns Instancia de ValidationFindingDto con los datos públicos.
     */
    mapToDto(): ValidationFindingDto {
        return {
            id: this.id,
            claim: this.claim,
            normalizedClaim: this.normalizedClaim,
            category: this.category,
            summary: this.summary,
            explanation: this.explanation,
            suggestion: this.suggestion,
            keywords: this.keywords ?? [],
            synonyms: this.synonyms ?? {},
            namedEntities: this.namedEntities ?? [],
            locations: this.locations ?? [],
            searchQuery: this.searchQuery,
            siteSuggestions: this.siteSuggestions ?? [],
            needsFactCheck: this.needsFactCheck,
            needsFactCheckReason: this.needsFactCheckReason,
            relatedFactId: this.relatedFactId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
