import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { env } from '@/config/env/env.config';
import { RawSearchResult } from '@/shared/types/raw-search-result.type';
import { enrichQueryWithSites } from '@/shared/utils/search/enrich-query-with-sites';

/**
 * Servicio para realizar búsquedas en Google Custom Search.
 */
@Injectable()
export class GoogleSearchService {
    private readonly baseUrl = 'https://www.googleapis.com/customsearch/v1';

    /**
     * Realiza una búsqueda en Google, usando filtros de sitios si se proporcionan.
     *
     * @param query - Texto de búsqueda.
     * @param siteSuggestions - Lista opcional de dominios preferentes.
     * @returns Lista de resultados crudos.
     */
    async search(
        query: string,
        siteSuggestions?: string[],
    ): Promise<RawSearchResult[]> {
        const enrichedQuery = enrichQueryWithSites(query, siteSuggestions);
        const response = await axios.get(this.baseUrl, {
            params: {
                key: env.GOOGLE_CLOUD_API_KEY,
                cx: env.GOOGLE_CX_ID,
                q: enrichedQuery,
                num: 10,
            },
        });

        return (response.data.items ?? []).map((item: any) => ({
            url: item.link,
            title: item.title,
            snippet: item.snippet,
        }));
    }
}
