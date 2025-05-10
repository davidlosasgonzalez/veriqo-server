export interface NewsApiArticle {
    url: string;
    title: string;
    description?: string;
    [key: string]: unknown;
}
