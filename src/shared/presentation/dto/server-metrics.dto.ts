import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class MemoryUsageDto {
    @ApiProperty()
    @Expose()
    rss: number;

    @ApiProperty()
    @Expose()
    heapTotal: number;

    @ApiProperty()
    @Expose()
    heapUsed: number;

    @ApiProperty()
    @Expose()
    external: number;

    @ApiProperty()
    @Expose()
    arrayBuffers: number;
}

export class ServerMetricsDto {
    @ApiProperty()
    @Expose()
    uptime: number;

    @ApiProperty()
    @Expose()
    timestamp: string;

    @ApiProperty({ type: MemoryUsageDto })
    @Expose()
    @Type(() => MemoryUsageDto)
    memoryUsage: MemoryUsageDto;

    @ApiProperty()
    @Expose()
    env: string;
}
