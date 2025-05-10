import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as morgan from 'morgan';

import { AppModule } from './app.module';
import { DatabaseSeederModule } from './shared/infrastructure/database/modules/database-seeder.module';
import { GlobalExceptionFilter } from './shared/presentation/filters/global-exceptions.filter';
import { GlobalValidationPipe } from './shared/presentation/pipes/global-validation.pipe';

import { env } from '@/config/env/env.config';

/**
 * Inicializa y arranca la aplicación NestJS.
 */
async function bootstrap() {
    try {
        const app = await NestFactory.create(AppModule);

        app.useGlobalPipes(new GlobalValidationPipe());
        app.useGlobalFilters(new GlobalExceptionFilter());
        app.setGlobalPrefix('api');
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

        if (process.env.NODE_ENV === 'development') {
            const seederModule = app.select(DatabaseSeederModule);
            const runner = seederModule.get(DatabaseSeederModule);

            if (runner && typeof runner.runSeeders === 'function') {
                console.log('Ejecutando seeders en entorno de desarrollo...');
                await runner.runSeeders();
            }
        }

        await app.listen(env.PORT);

        Logger.log(
            `Veriqo backend iniciado: http://localhost:${env.PORT}/api`,
            'Bootstrap',
        );
        Logger.log(
            `Swagger disponible en: http://localhost:${env.PORT}/api-docs`,
            'Bootstrap',
        );
    } catch (err) {
        Logger.error(
            'Error durante el bootstrap de NestJS',
            err instanceof Error ? err.stack : String(err),
            'Bootstrap',
        );
    }
}

void bootstrap();

/**
 * Maneja excepciones no controladas.
 */
process.on('uncaughtException', (err) => {
    Logger.error('Uncaught Exception', err.stack ?? String(err), 'Process');
});

/**
 * Maneja rechazos de promesas no manejados.
 */
process.on('unhandledRejection', (reason) => {
    Logger.error('Unhandled Rejection', String(reason), 'Process');
});
