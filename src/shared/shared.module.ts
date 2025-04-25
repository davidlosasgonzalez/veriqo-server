import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

/**
 * Módulo compartido entre todos los agentes y componentes del sistema.
 */
@Module({
    imports: [EventEmitterModule.forRoot(), HttpModule],
    exports: [EventEmitterModule, HttpModule],
})
export class SharedModule {}
