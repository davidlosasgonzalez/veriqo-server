import {
    Injectable,
    Inject,
    OnModuleInit,
    NotFoundException,
} from '@nestjs/common';
import { VerifyClaimDto } from './dto/verify-claim.dto';
import { IAgentFactRepository } from '@/application/interfaces/agent-fact-repository.interface';
import { IAgentFindingRepository } from '@/application/interfaces/agent-finding-repository.interface';
import { ValidatorOrchestratorService } from '@/application/services/validator/validator-orchestratos.service';
import { AgentFactRepositoryToken } from '@/application/tokens/agent-fact-repository.token';
import { AgentFindingRepositoryToken } from '@/application/tokens/agent-finding-repository.token';
import { UpdateAgentFactAfterVerificationUseCaseWrite } from '@/application/use-cases/write/update-agent-fact-after-verification.use-case.write';
import { VerifyFactUseCaseWrite } from '@/application/use-cases/write/verify-fact.use-case.write';
import { AgentFact } from '@/domain/entities/agent-fact.entity';
import { AgentFinding } from '@/domain/entities/agent-finding.entity';
import { EventBusService } from '@/shared/event-bus/event-bus.service';
import { AgentEventType } from '@/shared/types/enums/agent-event-type.enum';
import { FactualVerificationResultPayload } from '@/shared/types/payloads/factual-verification-result-event.payload';

/**
 * Servicio de fachada que conecta el controlador con los casos de uso de verificación de claims y acceso a datos.
 */
@Injectable()
export class ValidatorAgentService implements OnModuleInit {
    constructor(
        private readonly verifyFactUseCaseWrite: VerifyFactUseCaseWrite,
        private readonly updateAgentFactAfterVerificationUseCaseWrite: UpdateAgentFactAfterVerificationUseCaseWrite,
        private readonly eventBusService: EventBusService,
        private readonly verifyClaim: ValidatorOrchestratorService,

        @Inject(AgentFactRepositoryToken)
        private readonly agentFactRepository: IAgentFactRepository,

        @Inject(AgentFindingRepositoryToken)
        private readonly agentFindingRepository: IAgentFindingRepository,
    ) {}

    /**
     * Método ejecutado cuando el módulo es inicializado.
     * Escucha el evento de `FACTUAL_VERIFICATION_RESULT` para actualizar el `AgentFact` con el nuevo estado.
     */
    onModuleInit() {
        this.eventBusService.on(
            AgentEventType.FACTUAL_VERIFICATION_RESULT,
            async (payload: FactualVerificationResultPayload) => {
                console.log(
                    '[ValidatorAgent] FACTUAL_VERIFICATION_RESULT recibido:',
                    payload,
                );

                try {
                    await this.updateAgentFactAfterVerificationUseCaseWrite.execute(
                        {
                            factId: payload.factId,
                            newStatus: payload.newStatus,
                            newCategory: payload.newCategory,
                            newReasoning: {
                                summary: payload.reasoning.summary,
                                content: payload.reasoning.content,
                            },
                        },
                    );
                } catch (error) {
                    console.error(
                        '[ValidatorAgent] Error actualizando AgentFact tras verificación:',
                        error,
                    );
                }
            },
        );
    }

    /**
     * Analiza un claim utilizando el orquestador de validación.
     *
     * @param verifyClaimDto - DTO que contiene los datos del claim a analizar.
     * @returns Lista de `AgentFact` validados.
     */
    async analyze(verifyClaimDto: VerifyClaimDto): Promise<AgentFinding[]> {
        return this.verifyClaim.execute(verifyClaimDto);
    }

    /**
     * Obtiene un `AgentFinding` por su ID.
     *
     * @param id - ID del hallazgo.
     * @returns `AgentFinding` encontrado o lanza error si no se encuentra.
     */
    async getFindingById(id: string): Promise<AgentFinding> {
        const finding = await this.agentFindingRepository.findById(id);

        if (!finding) {
            throw new NotFoundException(
                `No se encontró ningún AgentFinding con ID ${id}`,
            );
        }

        return finding;
    }

    /**
     * Obtiene todos los hallazgos (`AgentFinding`).
     *
     * @returns Lista de `AgentFinding`.
     */
    async getAllFindings(): Promise<AgentFinding[]> {
        return this.agentFindingRepository.findAll();
    }

    /**
     * Recupera un fact específico por su ID.
     *
     * @param id - ID del hecho.
     * @returns `AgentFact` encontrado o lanza error si no se encuentra.
     */
    async getFactById(id: string): Promise<AgentFact> {
        const fact = await this.agentFactRepository.findById(id);

        if (!fact) {
            throw new NotFoundException(
                `No se encontró ningún AgentFact con ID ${id}`,
            );
        }

        return fact;
    }

    /**
     * Busca un `AgentFinding` por su claim.
     *
     * @param claim - Claim a buscar.
     * @returns `AgentFinding` encontrado o null si no existe.
     */
    async getFindingByClaim(claim: string): Promise<AgentFinding | null> {
        return this.agentFindingRepository.findByClaim(claim);
    }
}
