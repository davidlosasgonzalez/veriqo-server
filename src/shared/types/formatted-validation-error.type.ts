/**
 * Error de validación formateado de forma personalizada para respuestas HTTP.
 */
export type FormattedValidationError = {
    /**
     * Campo del DTO que contiene el error.
     */
    field: string;

    /**
     * Mensaje descriptivo del error asociado al campo.
     */
    message: string;
};
