import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';

import { ReasoningOrmEntity } from './reasoning.orm-entity';
import { VerificationOrmEntity } from './verification.orm-entity';

import { FindingOrmEntity } from '@/agents/validator-agent/infrastructure/entities/finding.orm-entity';
import {
    FACT_CATEGORY,
    type FactCategory,
} from '@/shared/domain/enums/fact-category.enum';
import {
    FACT_STATUS,
    type FactStatus,
} from '@/shared/domain/enums/fact-status.enum';

/**
 * Representa un hecho verificado por el sistema.
 */
@Entity('facts')
export class FactOrmEntity {
    /* Identificador único del hecho. */
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /* Estado factual del hecho (validado, rechazado o en proceso de verificación). */
    @Column({ type: 'enum', enum: FACT_STATUS })
    status: FactStatus;

    /* Categoría semántica del hecho (ej. factual, opinion, logical, etc.). */
    @Column({ type: 'enum', enum: FACT_CATEGORY })
    category: FactCategory;

    /* Lista de verificaciones asociadas a este hecho. */
    @OneToMany(() => VerificationOrmEntity, (v) => v.fact)
    verifications: VerificationOrmEntity[];

    /* Lista de razonamientos asociados a este hecho. */
    @OneToMany(() => ReasoningOrmEntity, (r) => r.fact)
    reasonings: ReasoningOrmEntity[];

    /* Lista de hallazgos asociados a este hecho. */
    @OneToMany(() => FindingOrmEntity, (f) => f.relatedFact)
    findings: FindingOrmEntity[];

    /* Fecha de creación del hecho en la base de datos. */
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    /* Fecha de última actualización del hecho en la base de datos. */
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
