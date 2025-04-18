import { Module } from '@nestjs/common';

import {
    VerifyClaimController,
    GetLastVerificationController,
    GetFactByClaimController,
    GetVerificationByIdController,
    GetFactHistoryController,
} from './controllers';

import { FactCheckerAgentListener } from './fact-checker-agent.listener';

import {
    VerifyClaimService,
    GetLastVerificationService,
    GetFactByClaimService,
    GetVerificationByIdService,
    GetFactHistoryService,
    HandleFactualCheckRequiredService,
} from './services';

import { SharedModule } from '@/shared/shared.module';

/**
 * Módulo que encapsula el FactCheckerAgent.
 * Se encarga de verificar afirmaciones de forma factual utilizando IA y búsqueda activa.
 */
@Module({
    imports: [SharedModule],
    controllers: [
        VerifyClaimController,
        GetLastVerificationController,
        GetFactByClaimController,
        GetVerificationByIdController,
        GetFactHistoryController,
    ],
    providers: [
        VerifyClaimService,
        GetLastVerificationService,
        GetFactByClaimService,
        GetVerificationByIdService,
        GetFactHistoryService,
        HandleFactualCheckRequiredService,
        FactCheckerAgentListener,
    ],
})
export class FactCheckerAgentModule {}
