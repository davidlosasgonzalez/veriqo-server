import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ensureValidatableObject } from '@/shared/utils/http/ensure-validatable-object';

/**
 * Pipe global que transforma y valida cualquier DTO usando class-validator y class-transformer.
 * Lanza una excepción 400 si la validación falla.
 */
@Injectable()
export class GlobalValidationPipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
        if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
            return value;
        }

        const object = plainToInstance(metadata.metatype, value);
        const validatableObject = ensureValidatableObject(object);
        const errors = await validate(validatableObject, {
            whitelist: true,
            forbidNonWhitelisted: true,
            forbidUnknownValues: false,
        });

        if (errors.length > 0) {
            throw new BadRequestException({
                message: 'Error de validación',
                errors: errors.map((err) => ({
                    property: err.property,
                    constraints: err.constraints,
                })),
            });
        }

        return object;
    }

    /**
     * Determina si el tipo recibido requiere validación.
     * @param metatype Tipo de metadatos recibido
     * @returns true si se debe validar, false en caso contrario
     */
    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];

        return !types.includes(metatype);
    }
}
