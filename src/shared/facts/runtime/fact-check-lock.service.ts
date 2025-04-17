import { Injectable, Logger } from '@nestjs/common';

/**
 * Servicio de bloqueo semántico en memoria basado en `normalizedClaim`,
 * utilizado para evitar verificaciones concurrentes del mismo claim.
 *
 * En el futuro puede sustituirse por Redis u otra store distribuida.
 */
@Injectable()
export class FactCheckLockService {
    private readonly locks: Map<string, NodeJS.Timeout> = new Map();
    private readonly logger = new Logger(FactCheckLockService.name);

    /** Tiempo de vida del lock (ms). Se podría mover a config si se requiere ajuste dinámico. */
    private readonly ttl = 2 * 60 * 1000; // 2 minutos

    /**
     * Intenta adquirir un lock para un claim normalizado.
     *
     * @param normalizedClaim Claim en su forma normalizada
     * @returns `true` si se adquirió el lock correctamente, `false` si ya estaba bloqueado
     */
    tryLock(normalizedClaim: string): boolean {
        if (this.locks.has(normalizedClaim)) {
            this.logger.debug(`Lock ya existe para: ${normalizedClaim}`);
            return false;
        }

        const timeout = setTimeout(() => {
            this.locks.delete(normalizedClaim);
            this.logger.debug(
                `Lock expirado automáticamente para: ${normalizedClaim}`,
            );
        }, this.ttl);

        this.locks.set(normalizedClaim, timeout);
        this.logger.debug(`Lock adquirido para: ${normalizedClaim}`);
        return true;
    }

    /**
     * Libera el lock asociado a un `normalizedClaim`.
     *
     * @param normalizedClaim Claim normalizado cuyo lock debe eliminarse
     */
    releaseLock(normalizedClaim: string): void {
        const timeout = this.locks.get(normalizedClaim);
        if (timeout) {
            clearTimeout(timeout);
            this.locks.delete(normalizedClaim);
            this.logger.debug(
                `Lock liberado manualmente para: ${normalizedClaim}`,
            );
        }
    }

    /**
     * Consulta si actualmente existe un lock activo para el claim.
     *
     * @param normalizedClaim Claim normalizado a consultar
     * @returns `true` si está bloqueado, `false` si está disponible
     */
    isLocked(normalizedClaim: string): boolean {
        return this.locks.has(normalizedClaim);
    }
}
