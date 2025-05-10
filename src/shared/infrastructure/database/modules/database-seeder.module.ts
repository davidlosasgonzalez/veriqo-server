import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { AgentPromptOrmEntity } from '../../entities/agent-prompt.orm-entity';
import { PromptSeeder } from '../seeders/prompt.seeder';

@Module({
    imports: [TypeOrmModule.forFeature([AgentPromptOrmEntity])],
})
export class DatabaseSeederModule {
    constructor(private readonly dataSource: DataSource) {}

    async runSeeders(): Promise<void> {
        await PromptSeeder(this.dataSource);
    }
}
