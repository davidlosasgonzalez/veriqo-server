import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import {
    AGENT_PROMPT_ROLE,
    AgentPromptRole,
} from '@/shared/domain/enums/agent-prompt-role.enum';

export class AgentPromptDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    agent: string;

    @ApiProperty()
    @Expose()
    type: string;

    @ApiProperty({ enum: AGENT_PROMPT_ROLE })
    @Expose()
    role: AgentPromptRole;

    @ApiProperty()
    @Expose()
    content: string;

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty()
    @Expose()
    updatedAt: Date;
}
