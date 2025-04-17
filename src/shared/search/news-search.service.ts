import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { config } from 'dotenv';
import { env } from '@/config/env/env.config';

config(); // Asegura que .env esté cargado

@Injectable()
export class NewsSearchService {
    private readonly logger = new Logger(NewsSearchService.name);
    private readonly apiKey = env.NEWS_API_KEY;
    private readonly baseUrl = 'https://newsapi.org/v2/everything';

    async search(
        query: string,
    ): Promise<{ url: string; title: string; description?: string }[]> {
        if (!this.apiKey) {
            this.logger.error('NEWS_API_KEY no está definido en el entorno.');
            return [];
        }

        try {
            this.logger.debug(
                `[NewsSearchService] Buscando en NewsAPI: "${query}"`,
            );

            const response = await axios.get(this.baseUrl, {
                params: {
                    q: query,
                    language: 'es',
                    sortBy: 'relevancy',
                    apiKey: this.apiKey,
                },
            });

            const articles = response.data.articles || [];

            this.logger.debug(
                `[NewsSearchService] ${articles.length} resultados encontrados.`,
            );

            return articles.map((article: any) => ({
                url: article.url,
                title: article.title,
                description: article.description,
            }));
        } catch (error) {
            this.logger.error(
                `[NewsSearchService] Error al buscar en NewsAPI: ${error.message}`,
            );
            return [];
        }
    }
}
