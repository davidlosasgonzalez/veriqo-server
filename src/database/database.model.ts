import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '@/config/typeorm/typeorm.config';

@Module({
    imports: [TypeOrmModule.forRoot(typeOrmConfig)],
    exports: [TypeOrmModule],
})
export class DatabaseModule {}
