import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { AppConfigService } from './app-config.service';
import { buildConfiguration } from './configuration';
import { validateEnvironment } from './environment.schema';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      // The repository root first, so one .env at the top level serves the whole monorepo,
      // with a package-local file available as an override.
      envFilePath: ['.env', '../../.env', 'apps/api/.env'],
      validate: validateEnvironment,
    }),
  ],
  providers: [
    {
      provide: AppConfigService,
      useFactory: () =>
        // `NestConfigModule.forRoot` has already loaded the env files into `process.env`
        // and validated them; this re-parse is what produces the typed, coerced shape.
        new AppConfigService(buildConfiguration(validateEnvironment(process.env))),
    },
  ],
  exports: [AppConfigService],
})
export class AppConfigModule {}
