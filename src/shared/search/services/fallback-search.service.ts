import { Injectable, Logger } from '@nestjs/common';

import { BraveSearchService } from './brave-search.service';
import { GoogleSearchService } from './google-search.service';
import { NewsSearchService } from './news-search.service';

import { RawSearchResult } from '@/shared/types/raw-search-result.type';

@Injectable()
export class FallbackSearchService {
    private readonly logger = new Logger(FallbackSearchService.name);

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
        } catch (err) {
            this.logger.warn(
                `Brave Search failed for query: "${query}"`,
                err instanceof Error ? err.stack : String(err),
            );
        }

        try {
            const googleResults = await this.googleSearchService.search(query);

            if (googleResults.length > 0) {
                return googleResults;
            }
        } catch (err) {
            this.logger.warn(
                `Google Search failed for query: "${query}"`,
                err instanceof Error ? err.stack : String(err),
            );
        }

        try {
            const newsResults = await this.newsSearchService.search(query);

            if (newsResults.length > 0) {
                return newsResults;
            }
        } catch (err) {
            this.logger.warn(
                `News Search failed for query: "${query}"`,
                err instanceof Error ? err.stack : String(err),
            );
        }

        return [];
    }
}
