import { Module } from '@nestjs/common';
import { ValidatorAgentController } from './validator-agent.controller';
import { ValidatorAgentService } from './validator-agent.service';
import { SharedModule } from '@/shared/shared.module';

/**
 * Módulo que encapsula la lógica del ValidatorAgent.
 * Se encarga de analizar afirmaciones y detectar errores o contradicciones.
 */
@Module({
    imports: [SharedModule],
    controllers: [ValidatorAgentController],
    providers: [ValidatorAgentService],
})
export class ValidatorAgentModule {}
