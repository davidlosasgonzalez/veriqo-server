import { Injectable } from '@nestjs/common';
import axios from 'axios';

type GoogleSearchResult = {
    url: string;
    title: string;
    snippet?: string;
    domain?: string;
};

@Injectable()
export class GoogleSearchService {
    private readonly apiKey = process.env.GOOGLE_CLOUD_API_KEY;
    private readonly cx = process.env.GOOGLE_CX_ID;
    private readonly baseUrl = 'https://www.googleapis.com/customsearch/v1';

    async search(query: string): Promise<GoogleSearchResult[]> {
        if (!query?.trim()) {
            console.error('[GoogleSearchService] ❌ Query vacío.');
            throw new Error('[GoogleSearchService] Query vacío no permitido.');
        }

        console.log(
            `[GoogleSearchService] 🔍 Buscando con Google CSE: "${query.trim()}"`,
        );

        try {
            const response = await axios.get(this.baseUrl, {
                params: {
                    key: this.apiKey,
                    cx: this.cx,
                    q: query.trim(),
                    num: 10,
                },
            });

            const items = response.data.items ?? [];

            if (items.length > 0) {
                console.log(
                    `[GoogleSearchService] ✅ Resultados obtenidos de Google: ${items.length}`,
                );
            } else {
                console.warn(
                    '[GoogleSearchService] ⚠️ Google no devolvió resultados.',
                );
            }

            return items.map((item: any) => ({
                url: item.link,
                title: item.title,
                snippet: item.snippet,
                domain: item.displayLink,
            }));
        } catch (err) {
            console.error(
                '[GoogleSearchService] ❌ Error en búsqueda Google:',
                err?.message,
            );
            return [];
        }
    }
}
