import { StructuredSearchPreview } from '@/core/database/entities/structured-search-preview.entity';
import { RawSearchResult } from '@/shared/types/raw-search-result.type';

/**
 * Preprocesa un resultado de búsqueda crudo y lo convierte en una vista previa estructurada.
 */
export function preprocessSearchPreview(
    raw: RawSearchResult,
): Omit<StructuredSearchPreview, 'id' | 'createdAt' | 'updatedAt'> {
    const cleanUrl = raw.url.trim();
    const domain = raw.domain || extractDomainFromUrl(cleanUrl);
    const language =
        detectLanguage(raw.snippet || raw.title || '') || 'unknown';
    const publishedAt = raw.publishedAt
        ? new Date(raw.publishedAt)
        : (extractPublishedDate(raw.snippet || '') ?? undefined);

    return {
        title: stripHtmlTags(raw.title || ''),
        snippet: stripHtmlTags(raw.snippet || ''),
        url: cleanUrl,
        domain,
        language,
        sourceType: inferSourceType(domain),
        publishedAt,
    };
}

/**
 * Construye una cadena enriquecida que describe la fuente para usar en prompts.
 */
export function buildContextFromPreview(
    preview: StructuredSearchPreview,
): string {
    return [
        preview.title ? `Título: ${preview.title}` : '',
        preview.snippet ? `Resumen: ${preview.snippet}` : '',
        preview.domain ? `Dominio: ${preview.domain}` : '',
        `URL: ${preview.url}`,
    ]
        .filter(Boolean)
        .join('\n');
}

/**
 * Elimina etiquetas HTML básicas de un texto.
 */
function stripHtmlTags(text: string): string {
    return text.replace(/<[^>]*>/g, '');
}

/**
 * Intenta inferir el tipo de fuente a partir del dominio o heurísticas comunes.
 */
function inferSourceType(domain: string): string {
    const d = domain.toLowerCase();
    if (d.includes('wikipedia')) return 'wiki';
    if (d.includes('youtube') || d.includes('youtu.be')) return 'video';
    if (d.includes('twitter') || d.includes('x.com')) return 'social';
    if (d.includes('medium') || d.includes('blogspot')) return 'blog';
    if (d.includes('nytimes') || d.includes('bbc') || d.includes('elpais'))
        return 'news';
    return 'unknown';
}

/**
 * Extrae el dominio de una URL.
 */
function extractDomainFromUrl(url: string): string {
    try {
        const parsed = new URL(url);
        return parsed.hostname.replace(/^www\./, '');
    } catch {
        return 'unknown';
    }
}

/**
 * Detección muy básica de idioma usando heurística.
 */
function detectLanguage(text: string): string | null {
    if (!text) return null;
    if (/[áéíóúñ]/i.test(text)) return 'es';
    if (/[àèìòù]/i.test(text)) return 'it';
    if (/[äöüß]/i.test(text)) return 'de';
    if (/[êâîôû]/i.test(text)) return 'fr';
    return 'en';
}

/**
 * Extrae una fecha potencial desde el texto.
 */
function extractPublishedDate(text: string): Date | null {
    const match = text.match(/\b(19|20)\d{2}\b/);
    return match ? new Date(`${match[0]}`) : null;
}
