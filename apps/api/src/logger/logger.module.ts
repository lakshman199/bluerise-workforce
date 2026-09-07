import { Module } from '@nestjs/common';
import { REQUEST_ID_HEADER, buildRedactionPaths } from '@bluerise/shared-config';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';

import { AppConfigModule } from '../config/config.module';
import { AppConfigService } from '../config/app-config.service';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        pinoHttp: {
          level: config.logging.level,
          // Redaction is configured centrally so a new route cannot opt out of it by
          // accident. See `packages/shared-config/src/redaction.ts` for the field list.
          redact: {
            paths: buildRedactionPaths(),
            censor: '[redacted]',
          },
          genReqId: (request: IncomingMessage, response: ServerResponse) => {
            const existing = request.headers[REQUEST_ID_HEADER];
            const id =
              typeof existing === 'string' && existing.length > 0
                ? existing
                : randomUUID();
            response.setHeader(REQUEST_ID_HEADER, id);
            return id;
          },
          customProps: () => ({
            service: config.app.name,
            environment: config.app.environment,
          }),
          // Health probes fire constantly and would otherwise dominate the log volume.
          autoLogging: {
            ignore: (request: IncomingMessage) =>
              typeof request.url === 'string' && request.url.includes('/health'),
          },
          transport: config.logging.pretty
            ? {
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                  colorize: true,
                  translateTime: 'HH:MM:ss.l',
                  ignore: 'pid,hostname,service,environment',
                },
              }
            : undefined,
        },
      }),
    }),
  ],
})
export class LoggerModule {}
