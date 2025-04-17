import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt } from 'class-validator';

export class CreateAgentLogDto {
    @ApiProperty({
        example: 'ValidatorAgent',
        description: 'Nombre del agente que generó el log.',
    })
    @IsString()
    readonly agentName: string;

    @ApiProperty({
        example: 'claude-3-5-sonnet',
        description: 'Nombre del modelo LLM utilizado.',
    })
    @IsString()
    readonly model: string;

    @ApiProperty({
        example: '¿Quién fue el primer presidente de España?',
        description: 'Prompt o mensaje enviado al modelo.',
    })
    @IsString()
    readonly inputPrompt: string;

    @ApiProperty({
        example: 'El primer presidente de la Primera República fue...',
        description: 'Respuesta generada por el modelo.',
    })
    @IsString()
    readonly outputResult: string;

    @ApiProperty({
        example: 123,
        description: 'Número de tokens de entrada utilizados.',
    })
    @IsInt()
    readonly tokensInput: number;

    @ApiProperty({
        example: 175,
        description: 'Número de tokens de salida generados.',
    })
    @IsInt()
    readonly tokensOutput: number;
}
