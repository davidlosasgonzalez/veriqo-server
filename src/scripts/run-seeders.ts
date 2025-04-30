import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { DatabaseSeederModule } from '@/infrastructure/database/database-seeder.module';

/**
 * IIFE asíncrona para ejecutar los seeders de la base de datos.
 */
void (async () => {
    try {
        const app = await NestFactory.createApplicationContext(AppModule, {
            logger: false,
        });
        const seederModule = app.select(DatabaseSeederModule);
        const runner = seederModule.get(DatabaseSeederModule);

        if (runner && typeof runner.runSeeders === 'function') {
            console.log('Ejecutando seeders...');
            await runner.runSeeders();
            console.log('Seeders ejecutados correctamente');
        } else {
            console.error('No se encontró DatabaseSeederModule o runSeeders()');
        }

        await app.close();
    } catch (err) {
        console.error('Error al ejecutar seeders:', err);
        process.exit(1);
    }
})();
