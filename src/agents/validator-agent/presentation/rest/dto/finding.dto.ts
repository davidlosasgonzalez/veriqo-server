import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import { FactDto } from '../../../../../shared/presentation/dto/fact.dto';

import { FindingSearchContextDto } from './finding-search-context.dto';

@Exclude()
export class FindingDto {
    @ApiProperty({ description: 'Identificador único del hallazgo.' })
    @Expose()
    id: string;

    @ApiProperty({
        description: 'Texto de la afirmación detectada y normalizada.',
    })
    @Expose()
    claim: string;

    @ApiProperty({ description: 'Vector de embedding asociado al claim.' })
    @Exclude()
    embedding?: number[];

    @ApiProperty({
        description: 'Motivo por el que se requiere fact-checking.',
        required: false,
    })
    @Expose()
    needsFactCheckReason?: string | null;

    @ApiProperty({
        description: 'Fact relacionado que valida o refuta este hallazgo.',
        type: () => FactDto,
    })
    @Expose()
    fact: FactDto;

    @ApiProperty({
        description: 'Contexto de búsqueda asociado al hallazgo (si existe).',
        type: () => FindingSearchContextDto,
        required: false,
    })
    @Expose()
    @Type(() => FindingSearchContextDto)
    searchContext?: FindingSearchContextDto | null;

    @ApiProperty({ description: 'Fecha de creación del hallazgo.' })
    @Expose()
    createdAt: Date;

    @ApiProperty({ description: 'Fecha de última actualización del hallazgo.' })
    @Expose()
    updatedAt: Date;
}
