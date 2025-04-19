import { Injectable } from '@nestjs/common';
import { LlmRouterService } from '@/shared/llm/llm-router.service';

/**
 * Servicio encargado de normalizar afirmaciones textuales
 * utilizando un modelo LLM configurado mediante el enrutador inteligente.
 *
 * La normalización consiste en transformar un claim en su forma
 * semánticamente canónica para evitar duplicados o ambigüedades.
 */
@Injectable()
export class ClaimNormalizerService {
    constructor(private readonly llmRouter: LlmRouterService) {}

    /**
     * Devuelve la versión normalizada de una afirmación textual.
     * @param claim Afirmación original (ej: "Pedro fue astronauta").
     * @returns Forma normalizada del claim (ej: "pedro astronauta").
     */
    async normalize(claim: string): Promise<string> {
        const response = await this.llmRouter.normalizeClaimWithLlm(claim);
        return response.normalizedClaim;
    }
}
