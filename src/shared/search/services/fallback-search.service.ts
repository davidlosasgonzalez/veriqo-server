import { Injectable } from '@nestjs/common';
import { BraveSearchService } from './brave-search.service';
import { GoogleSearchService } from './google-search.service';
import { NewsSearchService } from './news-search.service';
import { RawSearchResult } from '@/shared/types/raw-search-result.type';

/**
 * Servicio de búsqueda que intenta usar varios motores de búsqueda en orden.
 */
@Injectable()
export class FallbackSearchService {
    constructor(
        private readonly braveSearchService: BraveSearchService,
        private readonly googleSearchService: GoogleSearchService,
        private readonly newsSearchService: NewsSearchService,
    ) {}

    /**
     * Intenta buscar usando Brave, luego Google, luego NewsAPI.
     *
     * @param query - Texto de búsqueda.
     * @returns Lista de resultados crudos.
     */
    async search(query: string): Promise<RawSearchResult[]> {
        try {
            const braveResults = await this.braveSearchService.search(query);

            if (braveResults.length > 0) {
                return braveResults;
            }
        } catch (e) {
            console.error('[Fallback] Brave Search failed:', e);
        }

        try {
            const googleResults = await this.googleSearchService.search(query);

            if (googleResults.length > 0) {
                return googleResults;
            }
        } catch (e) {
            console.error('[Fallback] Google Search failed:', e);
        }

        try {
            const newsResults = await this.newsSearchService.search(query);

            if (newsResults.length > 0) {
                return newsResults;
            }
        } catch (e) {
            console.error('[Fallback] News Search failed:', e);
        }

        return [];
    }
}
