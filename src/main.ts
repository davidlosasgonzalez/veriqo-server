import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { env } from '@/config/env/env.config';
import { customValidationPipe } from '@/shared/pipes/custom-validation.pipe';
import { GlobalExceptionsFilter } from '@/shared/pipes/global-exceptions.filter';

async function bootstrap() {
    try {
        const app = await NestFactory.create(AppModule);

        app.setGlobalPrefix('api');
        app.useGlobalFilters(new GlobalExceptionsFilter());
        app.useGlobalPipes(customValidationPipe);
        app.use(morgan('dev'));

        const config = new DocumentBuilder()
            .setTitle('ATM System API')
            .setDescription(
                'API para el sistema ATM, gestionando cuentas y tarjetas.',
            )
            .setVersion('1.0')
            .addTag('atm')
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api-docs', app, document);

        await app.listen(env.PORT);

        console.log(
            `NestJS funcionando en http://localhost:${env.PORT ?? 3001}`,
        );
    } catch (error) {
        console.error('Error durante NestJS bootstrap:', error);
    }
}

bootstrap();

// Captura errores no controlados en tiempo de ejecución
process.on('uncaughtException', (err) => {
    console.error('🔥 Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
    console.error('🔥 Unhandled Rejection:', reason);
});
