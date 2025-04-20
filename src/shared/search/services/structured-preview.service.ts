import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StructuredSearchPreview } from '@/core/database/entities/structured-search-preview.entity';
import { RawSearchResult } from '@/shared/types/raw-search-result.type';
import { preprocessSearchPreview } from '@/shared/utils/search/preprocess-preview';

/**
 * Servicio encargado de transformar resultados de búsqueda en vistas previas estructuradas.
 */
@Injectable()
export class StructuredPreviewService {
    constructor(
        @InjectRepository(StructuredSearchPreview)
        private readonly previewRepo: Repository<StructuredSearchPreview>,
    ) {}

    /**
     * Transforma y guarda resultados raw de búsqueda como previews estructuradas.
     */
    async createFromRaw(
        raw: RawSearchResult[],
    ): Promise<StructuredSearchPreview[]> {
        const previews = raw
            .map(preprocessSearchPreview)
            .map((data) => this.previewRepo.create(data));

        return this.previewRepo.save(previews);
    }
}
