import { ApiProperty } from '@nestjs/swagger';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { VerificationVerdict } from '@/shared/types/verification-verdict.type';

@Entity('agent_facts')
export class AgentFact {
    @ApiProperty({ example: 'bbde9314-5011-46e0-aea1-f4bcae91e5c3' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'La velocidad de la luz depende del observador',
        description: 'Afirmación original que fue verificada por el agente.',
    })
    @Column({ name: 'claim', type: 'varchar', length: 512 })
    claim: string;

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
        description: 'Fuentes principales utilizadas para tomar la decisión.',
    })
    @Column('simple-array', { name: 'sources' })
    sources: string[];

    @ApiProperty()
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ApiProperty()
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
