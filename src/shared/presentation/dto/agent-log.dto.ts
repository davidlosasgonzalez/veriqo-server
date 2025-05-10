import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { AgentPromptDto } from './agent-prompt.dto';

export class AgentLogDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    agentName: string;

    @ApiProperty()
    @Expose()
    model: string;

    @ApiProperty()
    @Expose()
    inputPrompt: string;

    @ApiProperty()
    @Expose()
    outputResult: string;

    @ApiProperty()
    @Expose()
    tokensInput: number;

    @ApiProperty()
    @Expose()
    tokensOutput: number;

    @ApiProperty({ required: false })
    @Expose()
    elapsedTime?: number;

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty({ type: () => AgentPromptDto, required: false })
    @Expose()
    @Type(() => AgentPromptDto)
    prompt?: AgentPromptDto;
}
