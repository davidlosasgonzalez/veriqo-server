import { ApiProperty } from '@nestjs/swagger';
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('agent_facts')
export class AgentFact {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column({ type: 'text' })
    claim: string;

    @ApiProperty()
    @Column({ name: 'normalized_claim', type: 'text' })
    normalizedClaim: string;

    @Column({ name: 'embedding', type: 'simple-json', nullable: true })
    embedding?: number[];

    @ApiProperty({ enum: ['true', 'false', 'possibly_true', 'unknown'] })
    @Column({ type: 'varchar', length: 32 })
    status: string;

    @ApiProperty()
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ApiProperty()
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
