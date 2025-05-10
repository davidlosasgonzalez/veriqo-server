import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import {
    FACT_CATEGORY,
    type FactCategory,
} from '@/shared/domain/enums/fact-category.enum';
import {
    FACT_STATUS,
    type FactStatus,
} from '@/shared/domain/enums/fact-status.enum';

export class CreateFactDto {
    @ApiProperty({
        enum: FACT_STATUS,
        description: 'Estado del hecho verificado (validado, rechazado, etc.)',
        example: 'validated',
    })
    @IsEnum(FACT_STATUS)
    status: FactStatus;

    @ApiProperty({
        enum: FACT_CATEGORY,
        description: 'Categoría semántica del hecho (factual, lógico, etc.)',
        example: 'factual',
    })
    @IsEnum(FACT_CATEGORY)
    category: FactCategory;
}
