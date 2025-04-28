import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { env } from '@/config/env/env.config';
import { RawSearchResult } from '@/shared/types/raw-search-result.type';

/**
 * Servicio para realizar búsquedas en Google.
 */
@Injectable()
export class GoogleSearchService {
    private readonly baseUrl = 'https://www.googleapis.com/customsearch/v1';

    /**
     * Realiza una búsqueda en Google.
     *
     * @param query - Texto de búsqueda.
     * @returns Lista de resultados crudos.
     */
    async search(query: string): Promise<RawSearchResult[]> {
        const response = await axios.get(this.baseUrl, {
            params: {
                key: env.GOOGLE_CLOUD_API_KEY,
                cx: env.GOOGLE_CX_ID,
                q: query,
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
