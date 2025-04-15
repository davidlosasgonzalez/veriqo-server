import { Module } from '@nestjs/common';
import { ValidatorAgentController } from './validator-agent.controller';
import { ValidatorAgentService } from './validator-agent.service';
import { SharedModule } from '@/shared/shared.module';

@Module({
    imports: [SharedModule],
    controllers: [ValidatorAgentController],
    providers: [ValidatorAgentService],
})
export class ValidatorAgentModule {}
