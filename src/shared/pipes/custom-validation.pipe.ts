import {
    BadRequestException,
    ValidationPipe,
    ValidationError,
} from '@nestjs/common';
import { DataResponse } from '@/shared/types/base-response.type';
import { FormattedValidationError } from '@/shared/types/formatted-validation-error.type';

export const customValidationPipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors: ValidationError[]): BadRequestException => {
        console.log('[VALIDATION ERROR RAW]:', JSON.stringify(errors, null, 2));

        const errorList: FormattedValidationError[] = [];

        for (const err of errors) {
            const { property: field, constraints } = err;

            if (!constraints) continue;

            for (const key in constraints) {
                let message = constraints[key];

                if (message.includes('should not exist')) {
                    message = `La propiedad '${field}' no está permitida.`;
                }

                errorList.push({ field, message });
            }
        }

        const responseBody: DataResponse<FormattedValidationError[]> = {
            status: 'error',
            message: 'Validación fallida',
            data: errorList,
        };

        return new BadRequestException(responseBody);
    },
});
