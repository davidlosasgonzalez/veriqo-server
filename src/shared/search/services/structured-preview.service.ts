import { Injectable } from '@nestjs/common';
import { StructuredSearchPreview } from '@/domain/entities/structured-search-preview.entity';
import { RawSearchResult } from '@/shared/types/raw-search-result.type';
import { preprocessSearchPreview } from '@/shared/utils/search/preprocess-search-preview';

/**
 * Servicio para convertir resultados crudos de búsqueda en vistas estructuradas.
 */
@Injectable()
export class StructuredPreviewService {
    /**
     * Procesa una lista de resultados brutos a vistas previas estructuradas.
     *
     * @param results - Resultados crudos de la búsqueda.
     * @returns Lista de vistas previas estructuradas.
     */
    async process(
        results: RawSearchResult[],
    ): Promise<StructuredSearchPreview[]> {
        return results.map(preprocessSearchPreview);
    }
}
