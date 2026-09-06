import { Module } from '@nestjs/common';
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AppConfigModule } from '../config/config.module';
import { AppConfigService } from '../config/app-config.service';
import { dataSourceOptions } from './data-source';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService): TypeOrmModuleOptions => ({
        ...dataSourceOptions,
        type: 'postgres',
        url: config.database.url,
        ssl: config.database.ssl ? { rejectUnauthorized: false } : false,
        extra: { max: config.database.poolMax },
        logging: config.database.logQueries
          ? (['query', 'error'] as const)
          : (['error'] as const),
        // The application never migrates on boot. Migrations run as an explicit step so a
        // deployment cannot half-apply a schema change while serving traffic; the readiness
        // probe reports any that are still pending.
        synchronize: false,
        migrationsRun: false,
        // A failed connection at startup should surface immediately rather than leaving the
        // process retrying silently behind a healthy-looking port.
        retryAttempts: config.isProductionLike ? 5 : 1,
        retryDelay: 2000,
      }),
    }),
  ],
})
export class DatabaseModule {}
