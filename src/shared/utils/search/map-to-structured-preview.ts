import { StructuredSearchPreview } from '@/shared/domain/value-objects/structured-search-preview.vo';
import { RawSearchResult } from '@/shared/types/raw-search-result.type';

/**
 * Convierte un resultado crudo en una vista previa estructurada.
 */
export function mapToStructuredPreview(
    raw: RawSearchResult,
): StructuredSearchPreview {
    return new StructuredSearchPreview(
        raw.url,
        raw.title ?? '',
        raw.snippet ?? '',
        new Date(),
    );
}
