import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';
import { VerificationVerdict } from '@/shared/types/verification-verdict.type';

@Entity('agent_facts')
export class AgentFact {
    @ApiProperty({ example: 'bbde9314-5011-46e0-aea1-f4bcae91e5c3' })
    @PrimaryGeneratedColumn('uuid')
    readonly id: string;

    @ApiProperty({
        example: 'La velocidad de la luz depende del observador',
        description: 'Afirmación original que fue verificada por el agente.',
    })
    @Column({ name: 'claim', type: 'varchar', length: 512 })
    claim: string;

    @ApiProperty({
        description:
            'Versión normalizada del claim, útil para comparación semántica y evitar duplicados.',
        example: 'velocidad luz depende observador',
    })
    @Index('IDX_agent_fact_normalized_claim')
    @Column({
        type: 'varchar',
        length: 255,
        name: 'normalized_claim',
        nullable: true,
    })
    normalizedClaim?: string;

    @ApiHideProperty()
    @Column({
        type: 'json',
        nullable: true,
    })
    embedding?: number[];

    @ApiProperty({
        example: 'false',
        enum: ['true', 'false', 'possibly_true', 'unknown'],
        description: 'Resultado de la verificación factual.',
    })
    @Column({
        name: 'status',
        type: 'enum',
        enum: ['true', 'false', 'possibly_true', 'unknown'],
    })
    status: VerificationVerdict;

    @ApiProperty({
        type: [String],
        example: ['https://es.wikipedia.org/wiki/Velocidad_de_la_luz'],
        description:
            'Fuentes mencionadas durante el análisis factual (declaradas).',
    })
    @Column('json', { nullable: true })
    sources?: string[];

    @ApiProperty({
        type: [String],
        example: ['https://es.wikipedia.org/wiki/Velocidad_de_la_luz'],
        description: 'Fuentes principales utilizadas para tomar la decisión.',
    })
    @Column('json', { name: 'sources_used', nullable: true })
    sourcesUsed?: string[];

    @ApiProperty({
        description:
            'Razonamiento generado por el agente sobre la veracidad del claim.',
        example:
            'La mayoría de fuentes indican que la velocidad de la luz es constante...',
    })
    @Column({ type: 'text', name: 'reasoning', nullable: true })
    reasoning?: string;

    @ApiProperty({ example: '2025-04-16T23:41:23.430Z' })
    @CreateDateColumn({ name: 'created_at' })
    readonly createdAt: Date;

    @ApiProperty({ example: '2025-04-16T23:41:23.430Z' })
    @UpdateDateColumn({ name: 'updated_at' })
    readonly updatedAt: Date;
}
