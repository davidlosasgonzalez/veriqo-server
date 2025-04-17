import { Injectable } from '@nestjs/common';
import { BraveSearchService } from './brave-search.service';
import { GoogleSearchService } from './google-search.service';
import { NewsSearchService } from './news-search.service';
import { SearchEngineUsed } from '@/shared/types/search-engine-used.type';

/**
 * Servicio que intenta obtener resultados de múltiples motores de búsqueda en orden.
 */
@Injectable()
export class FallbackSearchService {
    constructor(
        private readonly brave: BraveSearchService,
        private readonly google: GoogleSearchService,
        private readonly news: NewsSearchService,
    ) {}

    /**
     * Ejecuta la búsqueda en Brave, luego Google, y finalmente NewsAPI.
     * @param claim Texto de búsqueda.
     * @returns Resultados con el motor utilizado.
     */
    async perform(
        claim: string,
    ): Promise<{ results: any[]; engineUsed: SearchEngineUsed }> {
        try {
            const braveResults = await this.brave.search(claim);
            if (braveResults.length) {
                return { results: braveResults, engineUsed: 'brave' };
            }
        } catch (err) {
            console.warn('[FallbackSearch] Brave falló:', err.message);
        }

        try {
            const googleQueries = [
                claim,
                claim.replace(/[^À-ſa-zA-Z0-9\s]/g, '').trim(),
                claim.split(' ').slice(0, 5).join(' '),
            ];

            for (const q of googleQueries) {
                const googleResults = await this.google.search(q);
                if (googleResults.length) {
                    return { results: googleResults, engineUsed: 'google' };
                }
            }
        } catch (err) {
            console.warn('[FallbackSearch] Google falló:', err.message);
        }

        try {
            const news = await this.news.search(claim);
            if (news.length) {
                const formatted = news.map((n) => ({
                    url: n.url,
                    snippet: `${n.title} ${n.description ?? ''}`,
                    domain: new URL(n.url).hostname,
                }));
                return { results: formatted, engineUsed: 'newsapi' };
            }
        } catch (err) {
            console.warn('[FallbackSearch] NewsAPI falló:', err.message);
        }

        return { results: [], engineUsed: 'fallback' };
    }
}
