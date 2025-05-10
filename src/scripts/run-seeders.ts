import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app.module';
import { DatabaseSeederModule } from '@/shared/infrastructure/database/modules/database-seeder.module';

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
            Logger.log('Ejecutando seeders...', 'SeedRunner');
            await runner.runSeeders();
            Logger.log('Seeders ejecutados correctamente', 'SeedRunner');
        } else {
            Logger.error(
                'No se encontró DatabaseSeederModule o runSeeders()',
                undefined,
                'SeedRunner',
            );
        }

        await app.close();
    } catch (err) {
        Logger.error(
            'Error al ejecutar seeders:',
            err instanceof Error ? err.stack : String(err),
            'SeedRunner',
        );

        process.exit(1);
    }
})();
