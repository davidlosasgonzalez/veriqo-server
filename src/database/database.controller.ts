import { Controller, Post, Body } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Controller('database')
export class DatabaseController {
    constructor(private readonly databaseService: DatabaseService) {}

    @Post('log')
    async createLog(@Body() body: any) {
        const {
            agent_name,
            model,
            input_prompt,
            output_result,
            tokens_input,
            tokens_output,
        } = body;
        return this.databaseService.createLog(
            agent_name,
            model,
            input_prompt,
            output_result,
            tokens_input,
            tokens_output,
        );
    }
}
