import { Injectable } from '@nestjs/common';

import { StructuredSearchPreview } from '@/shared/domain/value-objects/structured-search-preview.vo';
import { RawSearchResult } from '@/shared/types/raw-search-result.type';
import { mapToStructuredPreview } from '@/shared/utils/search/map-to-structured-preview';
import { mapToStructuredPreviews } from '@/shared/utils/search/map-to-structured-previews';

/**
 * Servicio para convertir resultados crudos de búsqueda en vistas previas estructuradas.
 */
@Injectable()
export class StructuredPreviewService {
    /**
     * Convierte múltiples resultados en vistas previas estructuradas.
     *
     * @param results - Resultados crudos (Brave, Google, NewsAPI...).
     * @returns Vistas estructuradas listas para el dominio.
     */
    async processMany(
        results: RawSearchResult[],
    ): Promise<StructuredSearchPreview[]> {
        return mapToStructuredPreviews(results);
    }

    /**
     * Convierte un único resultado en una vista previa estructurada.
     *
     * @param result - Resultado crudo individual.
     * @returns Vista estructurada.
     */
    async processOne(
        result: RawSearchResult,
    ): Promise<StructuredSearchPreview> {
        return mapToStructuredPreview(result);
    }
}
