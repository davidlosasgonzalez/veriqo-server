import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { env } from '@/config/env/env.config';
import { customValidationPipe } from '@/shared/pipes/custom-validation.pipe';
import { GlobalExceptionsFilter } from '@/shared/pipes/global-exceptions.filter';

/**
 * Punto de entrada de la aplicación NestJS.
 * Configura middlewares, Swagger, validaciones y filtros globales.
 */
async function bootstrap() {
    try {
        const app = await NestFactory.create(AppModule);

        app.setGlobalPrefix('api');
        app.useGlobalFilters(new GlobalExceptionsFilter());
        app.useGlobalPipes(customValidationPipe);
        app.use(morgan('dev'));

        const config = new DocumentBuilder()
            .setTitle('Veriqo API')
            .setDescription(
                'Backend modular de verificación factual automática mediante agentes LLM y recuperación activa de fuentes.',
            )
            .setVersion('1.0')
            .addTag('validator-agent')
            .addTag('fact-checker-agent')
            .addTag('core')
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api-docs', app, document);

        await app.listen(env.PORT);

        console.log(
            `Veriqo backend iniciado: http://localhost:${env.PORT}/api`,
        );
        console.log(
            `Swagger disponible en: http://localhost:${env.PORT}/api-docs`,
        );
    } catch (error) {
        console.error('Error durante el bootstrap de NestJS:', error);
    }
}

void bootstrap();

// Captura errores no controlados.
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
});
