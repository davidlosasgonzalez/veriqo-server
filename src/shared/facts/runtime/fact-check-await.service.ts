import { Injectable, Logger } from '@nestjs/common';
import { AgentFactService } from '../services/agent-fact.service';

/**
 * Servicio que espera activamente a que un fact equivalente esté disponible
 * en base a su normalizedClaim, o hasta que se alcance el timeout.
 */
@Injectable()
export class FactCheckAwaitService {
    private readonly logger = new Logger(FactCheckAwaitService.name);

    constructor(private readonly factService: AgentFactService) {}

    /**
     * Espera hasta que un fact válido esté disponible o se agote el timeout.
     * @param normalizedClaim Claim normalizado que se quiere comprobar
     * @param timeoutMs Tiempo máximo de espera en milisegundos (por defecto: 10000)
     * @param intervalMs Intervalo de reintento en milisegundos (por defecto: 1000)
     * @returns El AgentFact encontrado o null si no se resolvió
     */
    async waitForFactResolution(
        normalizedClaim: string,
        timeoutMs = 10000,
        intervalMs = 1000,
    ): Promise<ReturnType<AgentFactService['findByNormalizedClaim']> | null> {
        const start = Date.now();

        return new Promise((resolve) => {
            const check = async () => {
                try {
                    const fact =
                        await this.factService.findByNormalizedClaim(
                            normalizedClaim,
                        );

                    if (fact && fact.status !== 'unknown') {
                        return resolve(fact);
                    }

                    if (Date.now() - start >= timeoutMs) {
                        this.logger.debug(
                            `Timeout esperando fact para: ${normalizedClaim}`,
                        );
                        return resolve(null);
                    }

                    setTimeout(() => {
                        void check();
                    }, intervalMs);
                } catch (error) {
                    this.logger.error(
                        `Error durante la espera de resolución de fact: ${error.message}`,
                    );
                    return resolve(null);
                }
            };

            void check();
        });
    }
}
