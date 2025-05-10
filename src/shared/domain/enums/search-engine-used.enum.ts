/**
 * Enum de motores de búsqueda utilizados para la verificación factual.
 */
export const SEARCH_ENGINE_USED = {
    BRAVE: 'brave_search',
    GOOGLE: 'google_search',
    NEWS_API: 'news_api',
} as const;

export type SearchEngineUsed =
    (typeof SEARCH_ENGINE_USED)[keyof typeof SEARCH_ENGINE_USED];
