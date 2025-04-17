/**
 * Define los motores de búsqueda que puede haber utilizado el sistema.
 */
export type SearchEngineUsed =
    | 'brave' // Resultados obtenidos desde Brave Search
    | 'google' // Resultados obtenidos desde Google Programmable Search
    | 'newsapi' // Resultados obtenidos desde NewsAPI.org
    | 'fallback' // Agregado desde múltiples fuentes sin identificar (fallback)
    | 'unknown'; // No se logró determinar la fuente usada
