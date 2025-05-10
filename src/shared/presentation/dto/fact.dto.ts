import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { VerificationDto } from '../../../agents/fact-checker/presentation/rest/dto/verification.dto';

import { ReasoningDto } from './reasoning.dto';

import {
    FACT_CATEGORY,
    type FactCategory,
} from '@/shared/domain/enums/fact-category.enum';
import {
    FACT_STATUS,
    type FactStatus,
} from '@/shared/domain/enums/fact-status.enum';

@Exclude()
export class FactDto {
    @ApiProperty({ description: 'Identificador único del fact.' })
    @Expose()
    id: string;

    @ApiProperty({
        description:
            'Estado factual del fact: validated, rejected o fact_checking.',
        enum: FACT_STATUS,
    })
    @Expose()
    status: FactStatus;

    @ApiProperty({
        description:
            'Categoría semántica del fact: factual, opinion, logical, etc.',
        enum: FACT_CATEGORY,
    })
    @Expose()
    category: FactCategory;

    @ApiProperty({ description: 'Fecha de creación del fact.' })
    @Expose()
    createdAt: Date;

    @ApiProperty({ description: 'Fecha de última actualización del fact.' })
    @Expose()
    updatedAt: Date;

    @ApiProperty({
        description: 'Verificación externa asociada al fact (si existe).',
        required: false,
        type: () => VerificationDto,
    })
    @Expose()
    verification?: VerificationDto;

    @ApiProperty({
        description: 'Razonamiento generado internamente (si existe).',
        required: false,
        type: () => ReasoningDto,
    })
    @Expose()
    reasoning?: ReasoningDto;
}
