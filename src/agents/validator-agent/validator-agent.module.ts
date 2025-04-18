import { Module } from '@nestjs/common';

import {
    VerifyClaimController,
    GetAllFindingsController,
    GetFindingByIdController,
} from './controllers';

import {
    VerifyClaimService,
    GetAllFindingsService,
    GetFindingByIdService,
} from './services';

import { SharedModule } from '@/shared/shared.module';

/**
 * Módulo que encapsula la lógica del ValidatorAgent.
 * Se encarga de analizar afirmaciones y detectar errores o contradicciones.
 */
@Module({
    imports: [SharedModule],
    controllers: [
        VerifyClaimController,
        GetAllFindingsController,
        GetFindingByIdController,
    ],
    providers: [
        VerifyClaimService,
        GetAllFindingsService,
        GetFindingByIdService,
    ],
})
export class ValidatorAgentModule {}
