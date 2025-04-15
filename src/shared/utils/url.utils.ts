export function getDomainFromUrl(url: string): string {
    try {
        const domain = new URL(url).hostname;
        return domain.replace(/^www\./, '');
    } catch {
        return 'unknown';
    }
}
