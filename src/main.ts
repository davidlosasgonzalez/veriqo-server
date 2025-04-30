import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { DatabaseSeederModule } from './infrastructure/database/database-seeder.module';
import { env } from '@/config/env/env.config';
import { GlobalExceptionFilter } from '@/shared/pipes/global-exceptions.filter';
import { GlobalValidationPipe } from '@/shared/pipes/global-validation';

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

        console.log(
            `Veriqo backend iniciado: http://localhost:${env.PORT}/api`,
        );
        console.log(
            `Swagger disponible en: http://localhost:${env.PORT}/api-docs`,
        );
    } catch (err) {
        console.error('Error durante el bootstrap de NestJS:', err);
    }
}

void bootstrap();

/**
 * Maneja excepciones no controladas.
 */
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

/**
 * Maneja rechazos de promesas no manejados.
 */
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
});
