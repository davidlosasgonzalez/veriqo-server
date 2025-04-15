import { Module } from '@nestjs/common';
import { FactCheckerAgentController } from './fact-checker-agent.controller';
import { FactCheckerAgentListener } from './fact-checker-agent.listener';
import { FactCheckerAgentService } from './fact-checker-agent.service';
import { SharedModule } from '@/shared/shared.module';

@Module({
    imports: [SharedModule],
    controllers: [FactCheckerAgentController],
    providers: [FactCheckerAgentService, FactCheckerAgentListener],
})
export class FactCheckerAgentModule {}
