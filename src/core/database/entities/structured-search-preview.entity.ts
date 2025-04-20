import { ApiProperty } from '@nestjs/swagger';
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('structured_search_previews')
export class StructuredSearchPreview {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column({ type: 'varchar', length: 512 })
    url: string;

    @ApiProperty()
    @Column({ type: 'varchar', length: 128 })
    domain: string;

    @ApiProperty()
    @Column({ type: 'varchar', length: 256 })
    title: string;

    @ApiProperty({ nullable: true })
    @Column({ type: 'text', nullable: true })
    snippet?: string;

    @ApiProperty({
        example: 'wiki',
        enum: ['wiki', 'news', 'blog', 'video', 'academic', 'other'],
    })
    @Column({ type: 'varchar', length: 32 })
    sourceType: string;

    @ApiProperty({ nullable: true, example: '2024-12-01T00:00:00Z' })
    @Column({ type: 'timestamp', nullable: true })
    publishedAt?: Date;

    @ApiProperty({ nullable: true, example: 'es' })
    @Column({ type: 'varchar', length: 8, nullable: true })
    language?: string;

    @ApiProperty()
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
