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
 *
 * @implements PipeTransform
 */
@Injectable()
export class GlobalValidationPipe implements PipeTransform {
    /**
     * Transforma y valida los datos de entrada basándose en el DTO especificado.
     * Lanza un error `BadRequestException` si la validación falla.
     *
     * @param value - El valor a transformar y validar.
     * @param metadata - Metadatos del parámetro, incluyendo el tipo de DTO.
     * @returns El objeto transformado y validado si la validación es exitosa.
     * @throws BadRequestException Si la validación falla.
     */
    async transform<T = unknown>(
        value: T,
        metadata: ArgumentMetadata,
    ): Promise<T> {
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
     *
     * @param metatype - Tipo de metadatos recibido.
     * @returns `true` si se debe validar, `false` en caso contrario.
     */
    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];

        return !types.includes(metatype);
    }
}
