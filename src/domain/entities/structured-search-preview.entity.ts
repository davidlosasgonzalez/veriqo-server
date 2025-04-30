/**
 * Representa una vista previa estructurada de un resultado de búsqueda.
 */
export class StructuredSearchPreview {
    /* URL del resultado. */
    url!: string;

    /* Título del resultado. */
    title!: string;

    /* Fragmento o resumen del contenido. */
    snippet!: string;

    /* Fecha de extracción del resultado. */
    extractedAt!: Date;
}
