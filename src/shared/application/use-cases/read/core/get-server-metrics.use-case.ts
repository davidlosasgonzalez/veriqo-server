import { Injectable } from '@nestjs/common';

import { ServerMetricsDto } from '@/shared/presentation/dto/server-metrics.dto';

@Injectable()
export class GetServerMetricsUseCase {
    async execute(): Promise<ServerMetricsDto> {
        const memory = process.memoryUsage();

        return {
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            memoryUsage: {
                rss: memory.rss,
                heapTotal: memory.heapTotal,
                heapUsed: memory.heapUsed,
                external: memory.external,
                arrayBuffers: memory.arrayBuffers,
            },
            env: process.env.NODE_ENV || 'development',
        };
    }
}
