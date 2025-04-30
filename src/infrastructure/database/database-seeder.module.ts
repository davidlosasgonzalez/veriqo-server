import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PromptSeeder } from './seeders/prompt.seeder';
import { AgentPromptEntity } from './typeorm/entities/agent-prompt.entity';

/**
 * Módulo de utilidad para ejecutar seeders en entornos de desarrollo o pruebas.
 */
@Module({
    imports: [TypeOrmModule.forFeature([AgentPromptEntity])],
})
export class DatabaseSeederModule {
    constructor(private readonly dataSource: DataSource) {}

    /**
     * Ejecuta los seeders registrados.
     */
    async runSeeders(): Promise<void> {
        await PromptSeeder(this.dataSource);
    }
}
