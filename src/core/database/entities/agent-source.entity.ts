import { ApiProperty } from '@nestjs/swagger';
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';

@Entity('agent_sources')
@Index(['claim'])
export class AgentSource {
    @ApiProperty({ example: 'bbde9314-5011-46e0-aea1-f4bcae91e5c3' })
    @PrimaryGeneratedColumn('uuid')
    readonly id: string;

    @ApiProperty({ example: 'e9c94c7f-3f7b-4d6f-9c21-0fd8aa6c4fd7' })
    @Column({ name: 'verification_id', type: 'uuid' })
    verificationId: string;

    @ApiProperty({ example: 'fact_checker_agent' })
    @Column({ type: 'varchar', length: 64 })
    agent: string;

    @ApiProperty({
        example: 'David Losas González es programador.',
        description: 'Afirmación a la que pertenece la fuente.',
    })
    @Column({ type: 'varchar', length: 512 })
    claim: string;

    @ApiProperty({
        example: 'https://linkedin.com/in/david-losas-gonzalez',
        description: 'URL de la fuente utilizada durante la verificación.',
    })
    @Column({ type: 'text' })
    url: string;

    @ApiProperty({ example: 'linkedin.com' })
    @Column({ type: 'varchar', length: 128 })
    domain: string;

    @ApiProperty({
        example: 'Perfil profesional de David Losas',
        description: 'Fragmento o contexto útil extraído de la fuente.',
    })
    @Column({ type: 'text', nullable: true })
    snippet: string | null;

    @ApiProperty({ example: '2025-04-16T23:41:23.430Z' })
    @CreateDateColumn({ name: 'created_at' })
    readonly createdAt: Date;

    @ApiProperty({ example: '2025-04-16T23:41:23.430Z' })
    @UpdateDateColumn({ name: 'updated_at' })
    readonly updatedAt: Date;
}
