import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ExecuteValidatorDto {
    @ApiProperty({
        example: 'Pedro Gómez fue astronauta de la NASA.',
        description: 'Texto que deseas que el ValidatorAgent analice.',
    })
    @IsString()
    @MinLength(5)
    prompt: string;
}
