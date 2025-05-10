import { mapToStructuredPreview } from './map-to-structured-preview';

import { StructuredSearchPreview } from '@/shared/domain/value-objects/structured-search-preview.vo';
import { RawSearchResult } from '@/shared/types/raw-search-result.type';

/**
 * Convierte una lista de resultados crudos en vistas previas estructuradas.
 */
export function mapToStructuredPreviews(
    results: RawSearchResult[],
): StructuredSearchPreview[] {
    return results.map(mapToStructuredPreview);
}
