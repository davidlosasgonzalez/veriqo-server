import { ApiProperty } from '@nestjs/swagger';
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    Index,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { AgentVerification } from './agent-verifications.entity';

@Entity('agent_sources')
@Index(['claim'])
export class AgentSource {
    @ApiProperty({ example: 'bbde9314-5011-46e0-aea1-f4bcae91e5c3' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: 'fact_checker_agent' })
    @Column({ type: 'varchar', length: 64 })
    agent: string;

    @ApiProperty({
        example: 'David Losas Gonzalez es programador.',
        description: 'Afirmación a la que pertenece la fuente',
    })
    @Column({ type: 'varchar', length: 512 })
    claim: string;

    @ApiProperty({
        example: 'https://linkedin.com/in/david-losas-gonzalez',
        description: 'Fuente utilizada durante la verificación',
    })
    @Column({ type: 'text' })
    url: string;

    @ApiProperty({ example: 'linkedin.com' })
    @Column({ type: 'varchar', length: 128 })
    domain: string;

    @ApiProperty({ example: 'Perfil profesional de David Losas' })
    @Column({ type: 'text', nullable: true })
    snippet: string | null;

    @ManyToOne(() => AgentVerification, (v) => v.sources, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'verification_id' })
    verification: AgentVerification;

    @ApiProperty()
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ApiProperty()
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
