import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseResponse } from '@/shared/types/http-response.type';
import { isHttpExceptionResponseWithData } from '@/shared/utils/http/is-http-exception-response-with-data';
import { isHttpExceptionResponseWithMessage } from '@/shared/utils/http/is-http-exception-response-with-message';

/**
 * Filtro global que transforma todas las excepciones en una respuesta uniforme.
 * Se aplica automáticamente a todas las rutas si se registra como global.
 */
@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void {
        console.log('[GLOBAL EXCEPTION CAUGHT]:', exception);

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Error interno del servidor';
        let data: unknown = undefined;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            } else {
                if (isHttpExceptionResponseWithMessage(exceptionResponse)) {
                    message = exceptionResponse.message;
                }

                if (isHttpExceptionResponseWithData(exceptionResponse)) {
                    data = exceptionResponse.data;
                }
            }
        }

        const responseBody: BaseResponse | (BaseResponse & { data: unknown }) =
            {
                status: 'error',
                message,
                ...(data !== undefined && { data }),
            };

        response.status(status).json(responseBody);
    }
}
