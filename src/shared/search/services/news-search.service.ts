import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { env } from '@/config/env/env.config';
import { RawSearchResult } from '@/shared/types/raw-search-result.type';

/**
 * Servicio para realizar búsquedas en NewsAPI.
 */
@Injectable()
export class NewsSearchService {
    private readonly baseUrl = 'https://newsapi.org/v2/everything';

    /**
     * Realiza una búsqueda en NewsAPI.
     *
     * @param query - Texto de búsqueda.
     * @returns Lista de resultados crudos.
     */
    async search(query: string): Promise<RawSearchResult[]> {
        const response = await axios.get(this.baseUrl, {
            headers: {
                'X-Api-Key': env.NEWS_API_KEY,
            },
            params: {
                q: query,
                sortBy: 'publishedAt',
                pageSize: 10,
                language: 'es',
            },
        });

        return (response.data.articles ?? []).map((article: any) => ({
            url: article.url,
            title: article.title,
            snippet: article.description ?? '',
        }));
    }
}
