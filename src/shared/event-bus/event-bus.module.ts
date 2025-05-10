import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { EventBusService } from './event-bus.service';

@Module({
    imports: [CqrsModule],
    providers: [EventBusService],
    exports: [EventBusService],
})
export class EventBusModule {}
