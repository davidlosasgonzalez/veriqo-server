import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { env } from '@/config/env/env.config';
import { RawSearchResult } from '@/shared/types/raw-search-result.type';

/**
 * Servicio para realizar búsquedas en Brave.
 */
@Injectable()
export class BraveSearchService {
    private readonly baseUrl = 'https://api.search.brave.com/res/v1/web/search';

    /**
     * Realiza una búsqueda en Brave.
     *
     * @param query - Texto de búsqueda.
     * @returns Lista de resultados crudos.
     */
    async search(query: string): Promise<RawSearchResult[]> {
        const response = await axios.get(this.baseUrl, {
            headers: {
                Accept: 'application/json',
                'Accept-Encoding': 'gzip',
                'X-Subscription-Token': env.BRAVE_API_KEY,
            },
            params: {
                q: query,
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
    }
}
