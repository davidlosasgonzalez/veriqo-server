import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class FindingSearchContextDto {
    @ApiProperty({ description: 'Identificador único del contexto.' })
    @Expose()
    id: string;

    @ApiProperty({
        description: 'Consulta estructurada generada para la búsqueda.',
    })
    @Expose()
    searchQuery: Record<string, string>;

    @ApiProperty({
        description: 'Sugerencias de sitios web para enfocar la búsqueda.',
        required: false,
    })
    @Expose()
    siteSuggestions?: string[] | null;

    @ApiProperty({ description: 'Fecha de creación del contexto.' })
    @Expose()
    createdAt: Date;

    @ApiProperty({ description: 'Fecha de última modificación del contexto.' })
    @Expose()
    updatedAt: Date;
}
