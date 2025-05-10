import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    ManyToOne,
} from 'typeorm';

import { FactOrmEntity } from './fact.orm-entity';
import { VerificationOrmEntity } from './verification.orm-entity';

/**
 * Representa un razonamiento generado por un agente, utilizado para validar una afirmación.
 */
@Entity('reasoning')
export class ReasoningOrmEntity {
    /* Identificador único del razonamiento. */
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /* Resumen breve del razonamiento. */
    @Column('text')
    summary: string;

    /* Contenido completo del razonamiento. */
    @Column('text')
    content: string;

    /* Verificación que motivó este razonamiento. */
    @OneToOne(
        () => VerificationOrmEntity,
        (verification) => verification.reasoning,
        { onDelete: 'CASCADE', nullable: true },
    )
    @JoinColumn({ name: 'verification_id' })
    verification: VerificationOrmEntity | null;

    /* Fact al que pertenece este razonamiento. */
    @ManyToOne(() => FactOrmEntity, (fact) => fact.reasonings, {
        onDelete: 'CASCADE',
        nullable: true,
    })
    @JoinColumn({ name: 'fact_id' })
    fact: FactOrmEntity | null;

    /* Fecha de creación del razonamiento. */
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    /* Fecha de última actualización del razonamiento. */
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
