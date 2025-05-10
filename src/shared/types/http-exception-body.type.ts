export interface HttpExceptionBody {
    message?: string | string[];
    error?: string;
    [key: string]: unknown;
}
