import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { GoogleSearchService } from './google-search.service';

type BraveSearchResult = {
    url: string;
    title: string;
    snippet?: string;
    domain?: string;
};

@Injectable()
export class BraveSearchService {
    private readonly baseUrl = 'https://api.search.brave.com/res/v1/web/search';
    private readonly apiKey = process.env.BRAVE_SEARCH_API_KEY;

    constructor(private readonly googleSearch: GoogleSearchService) {}

    async search(query: string): Promise<BraveSearchResult[]> {
        if (!query || !query.trim()) {
            console.error('[BraveSearchService] ❌ Query vacío.');
            throw new Error('[BraveSearchService] Query vacío no permitido.');
        }

        console.log(
            `[BraveSearchService] 🔍 Buscando con Brave: "${query.trim()}"`,
        );

        try {
            const response = await axios.get(this.baseUrl, {
                headers: {
                    Accept: 'application/json',
                    'X-Subscription-Token': this.apiKey,
                },
                params: {
                    q: query.trim(),
                    count: 10,
                    safesearch: 'off',
                },
            });

            const webResults = response.data.web?.results ?? [];

            if (webResults.length > 0) {
                console.log(
                    `[BraveSearchService] ✅ Resultados obtenidos de Brave: ${webResults.length}`,
                );
                return webResults.map((r: any) => ({
                    url: r.url,
                    title: r.title,
                    snippet: r.description ?? undefined,
                    domain: r.profile?.domain ?? undefined,
                }));
            }

            // Fallback a Google si Brave no encuentra nada
            console.warn(
                '[BraveSearchService] ⚠️ Brave no devolvió resultados. Fallback a Google.',
            );
            return this.googleSearch.search(query);
        } catch (error) {
            console.error(
                '[BraveSearchService] ❌ Error en búsqueda Brave:',
                error?.message,
            );
            console.warn(
                '[BraveSearchService] Fallback automático a Google Search.',
            );
            return this.googleSearch.search(query);
        }
    }
}
