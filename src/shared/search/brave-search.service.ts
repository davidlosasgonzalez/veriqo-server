import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { env } from '@/config/env/env.config';

@Injectable()
export class BraveSearchService {
    private readonly apiKey = process.env.BRAVE_API_KEY;
    private readonly baseUrl = 'https://api.search.brave.com/res/v1/web/search';

    async search(
        query: string,
    ): Promise<{ url: string; domain?: string; snippet?: string }[]> {
        const sanitizedQuery = this.sanitizeQuery(query);
        console.log(
            '[BraveSearchService] 🔍 Buscando con Brave:',
            `"${sanitizedQuery}"`,
        );

        try {
            const response = await axios.get(this.baseUrl, {
                params: { q: `"${sanitizedQuery}"`, count: 10 },
                headers: {
                    Accept: 'application/json',
                    'X-Subscription-Token': this.apiKey,
                },
            });

            const results = response.data.web?.results || [];
            return results.map((item: any) => ({
                url: item.url,
                domain: item.domain,
                snippet: item.description,
            }));
        } catch (err) {
            console.log(
                '[BraveSearchService] ❌ Error en búsqueda Brave:',
                err.message,
            );
            throw new Error('BraveSearchError');
        }
    }

    private sanitizeQuery(q: string): string {
        return q
            .replace(/[^\w\sáéíóúÁÉÍÓÚñÑ.,-]/gi, '')
            .replace(/\s+/g, ' ')
            .trim();
    }
}
