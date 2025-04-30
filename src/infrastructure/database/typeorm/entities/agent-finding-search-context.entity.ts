import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { AgentFindingEntity } from './agent-finding.entity';

/**
 * Contiene la información auxiliar generada por el ValidatorAgent para facilitar búsquedas externas o comparaciones semánticas.
 */
@Entity('agent_finding_search_contexts')
export class AgentFindingSearchContextEntity {
    /**
     * Identificador único del contexto de búsqueda.
     */
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * Consulta de búsqueda estructurada generada para búsqueda externa.
     */
    @Column({ name: 'search_query', type: 'json' })
    searchQuery: Record<string, string>;

    /**
     * Sugerencias de sitios específicos para limitar la búsqueda.
     */
    @Column({ name: 'site_suggestions', type: 'simple-array', nullable: true })
    siteSuggestions?: string[] | null;

    /**
     * Hallazgo asociado a este contexto de búsqueda.
     */
    @OneToOne(() => AgentFindingEntity, (finding) => finding.searchContext, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'finding_id' })
    finding: AgentFindingEntity;

    /**
     * Fecha de creación del contexto.
     */
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    /**
     * Fecha de última actualización del contexto.
     */
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
