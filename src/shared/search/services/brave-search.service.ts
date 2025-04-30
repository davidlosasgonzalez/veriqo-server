import { Injectable } from '@nestjs/common';
import axios from 'axios';
import Bottleneck from 'bottleneck';
import { env } from '@/config/env/env.config';
import { RawSearchResult } from '@/shared/types/raw-search-result.type';
import { enrichQueryWithSites } from '@/shared/utils/search/enrich-query-with-sites';

/**
 * Servicio para realizar búsquedas en Brave, respetando límites de rate.
 */
@Injectable()
export class BraveSearchService {
    private readonly baseUrl = 'https://api.search.brave.com/res/v1/web/search';
    private readonly limiter = new Bottleneck({
        minTime: 1200,
    });

    /**
     * Realiza una búsqueda en Brave, aplicando rate limiting.
     *
     * @param query - Texto de búsqueda.
     * @param siteSuggestions - Lista opcional de dominios preferentes.
     * @returns Lista de resultados crudos.
     * @throws Error si Brave devuelve 429 u otro error.
     */
    async search(
        query: string,
        siteSuggestions?: string[],
    ): Promise<RawSearchResult[]> {
        const enrichedQuery = enrichQueryWithSites(query, siteSuggestions);

        return this.limiter.schedule(async () => {
            try {
                const response = await axios.get(this.baseUrl, {
                    headers: {
                        Accept: 'application/json',
                        'Accept-Encoding': 'gzip',
                        'X-Subscription-Token': env.BRAVE_API_KEY,
                    },
                    params: {
                        q: enrichedQuery,
                        count: 10,
                        text_decorations: false,
                        text_format: 'raw',
                    },
                });

                return (response.data.web?.results ?? []).map((item: any) => ({
                    url: item.url,
                    title: item.title,
                    snippet: item.description,
                }));
            } catch (err: any) {
                if (err.response?.status === 429) {
                    console.warn('[Brave] Rate limit exceeded');
                    throw new Error('BRAVE_RATE_LIMIT');
                }

                throw err;
            }
        });
    }
}
