import { Module } from '@nestjs/common';
import { FactCheckerAgentModule } from './fact-checker-agent/fact-checker-agent.module';
import { ValidatorAgentModule } from './validator-agent/validator-agent.module';

@Module({
    imports: [ValidatorAgentModule, FactCheckerAgentModule],
    exports: [ValidatorAgentModule, FactCheckerAgentModule],
})
export class AgentsModule {}
