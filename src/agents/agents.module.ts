import { Module } from '@nestjs/common';
import { FactCheckerAgentModule } from './fact-checker-agent/fact-checker-agent.module';
import { ValidatorAgentModule } from './validator-agent/validator-agent.module';

/**
 * Módulo principal de agentes.
 * Agrupa los módulos del ValidatorAgent y FactCheckerAgent.
 */
@Module({
    imports: [ValidatorAgentModule, FactCheckerAgentModule],
    exports: [ValidatorAgentModule, FactCheckerAgentModule],
})
export class AgentsModule {}
