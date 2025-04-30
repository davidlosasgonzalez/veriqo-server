import { StructuredSearchPreview } from '@/domain/entities/structured-search-preview.entity';
import { RawSearchResult } from '@/shared/types/raw-search-result.type';

/**
 * Convierte un resultado de búsqueda crudo en una vista previa estructurada.
 *
 * @param raw - Resultado bruto a procesar.
 * @returns Vista previa estructurada lista para el FactCheckerAgent.
 */
export function preprocessSearchPreview(
    raw: RawSearchResult,
): StructuredSearchPreview {
    return {
        url: raw.url,
        title: raw.title ?? '',
        snippet: raw.snippet ?? '',
        extractedAt: new Date(),
    };
}
