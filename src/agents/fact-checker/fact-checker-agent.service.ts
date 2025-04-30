import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common'; // <-- Añadido NotFoundException
import { VerifyFactUseCaseWrite } from '@/application/use-cases/write/verify-fact.use-case.write';
import { AgentVerification } from '@/domain/entities/agent-verification.entity';
import { AgentVerificationRepository } from '@/infrastructure/database/typeorm/repositories/agent-verification.repository';
import { EventBusService } from '@/shared/event-bus/event-bus.service';
import { AgentEventType } from '@/shared/types/enums/agent-event-type.enum';
import { FactualCheckRequiredEventPayload } from '@/shared/types/payloads/factual-check-required-event.payload';

/**
 * Servicio principal del FactCheckerAgent.
 */
@Injectable()
export class FactCheckerAgentService implements OnModuleInit {
    constructor(
        private readonly verifyFactUseCaseWrite: VerifyFactUseCaseWrite,
        private readonly eventBusService: EventBusService,
        private readonly agentVerificationRepository: AgentVerificationRepository,
    ) {}

    /**
     * Se registra el agente para escuchar eventos al inicializar el módulo.
     */
    onModuleInit() {
        this.eventBusService.on(
            AgentEventType.FACTUAL_CHECK_REQUIRED,
            async (payload: FactualCheckRequiredEventPayload) => {
                console.log('[FactCheckerAgent] Event received:', payload);

                try {
                    await this.verifyFact(payload.factId, payload.claim);
                } catch (error) {
                    console.error(
                        '[FactCheckerAgent] Error handling FACTUAL_CHECK_REQUIRED:',
                        error,
                    );
                }
            },
        );
    }

    /**
     * Verifica una afirmación utilizando búsqueda externa y modelo LLM.
     *
     * @param factId - ID del AgentFact relacionado, o null si es verificación directa.
     * @param claim - Texto de la afirmación a verificar.
     * @returns Verificación creada.
     */
    async verifyFact(
        factId: string | null,
        claim: string,
    ): Promise<AgentVerification> {
        return this.verifyFactUseCaseWrite.execute(factId, claim);
    }

    /**
     * Recupera una verificación factual por su ID.
     *
     * @param id - Identificador de la verificación.
     * @returns Verificación si existe, o lanza 404 si no existe.
     */
    async getVerificationById(id: string): Promise<AgentVerification> {
        const verification =
            await this.agentVerificationRepository.findById(id);

        if (!verification) {
            throw new NotFoundException(
                `No se encontró ninguna AgentVerification con ID ${id}`,
            );
        }

        return verification;
    }
}
