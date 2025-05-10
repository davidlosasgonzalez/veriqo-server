import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpExceptionBody,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Filtro global para capturar y manejar excepciones en toda la aplicación.
 * Ofrece respuesta uniforme para errores HTTP y no HTTP.
 *
 * @implements ExceptionFilter
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    /**
     * Captura las excepciones y genera una respuesta uniforme.
     *
     * @param exception - La excepción que se ha lanzado.
     * @param host - El contexto que contiene la solicitud y la respuesta.
     * @returns Respuesta JSON con el código de estado y los detalles del error.
     */
    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest<Request>();

        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const body = exception.getResponse();

            const parsedBody: Partial<HttpExceptionBody> =
                typeof body === 'string' ? { message: body } : (body as object);

            res.status(status).json({
                statusCode: status,
                message: parsedBody.message ?? 'Unexpected error',
                error: parsedBody.error ?? exception.name,
                timestamp: new Date().toISOString(),
                path: req.url,
            });
        } else {
            const status = HttpStatus.INTERNAL_SERVER_ERROR;

            if (process.env.NODE_ENV === 'development') {
                console.error('[Unhandled Exception]', exception);
            }

            const err = exception as { message?: string; name?: string };

            res.status(status).send({
                statusCode: status,
                message: err.message || 'Error interno del servidor',
                error: err.name || 'InternalServerError',
                timestamp: new Date().toISOString(),
                path: req.url,
            });
        }
    }
}
