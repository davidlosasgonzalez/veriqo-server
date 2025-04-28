import { Module } from '@nestjs/common';
import { EventBusService } from './event-bus.service';

/**
 * Módulo que provee y exporta el servicio `EventBusService`.
 */
@Module({
    providers: [EventBusService],
    exports: [EventBusService],
})
export class EventBusModule {}
