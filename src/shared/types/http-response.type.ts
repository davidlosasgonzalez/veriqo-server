/**
 * Estructura base para respuestas HTTP uniformes.
 */
export type BaseResponse = {
    status: 'ok' | 'error';
    message: string;
};

/**
 * Respuesta estándar HTTP con datos adicionales.
 *
 * @template T Tipo del contenido en `data`.
 */
export type DataResponse<T> = BaseResponse & {
    data: T;
};
