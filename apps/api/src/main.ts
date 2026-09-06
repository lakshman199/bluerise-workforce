import 'reflect-metadata';

import { HttpStatus, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  API_GLOBAL_PREFIX,
  API_VERSION,
  MAX_REQUEST_BODY_BYTES,
  OPENAPI_PATH,
} from '@bluerise/shared-config';
import helmet from 'helmet';
import { Logger as PinoLogger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { AppConfigService } from './config/app-config.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // Buffered until the Pino logger is attached, so startup lines are not lost and are
    // not emitted in a second format.
    bufferLogs: true,
  });

  app.useLogger(app.get(PinoLogger));
  const config = app.get(AppConfigService);

  app.use(
    helmet({
      // The API serves JSON, never a document, so a restrictive CSP costs nothing and
      // closes off the class of attacks that rely on an API rendering HTML.
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'none'"],
          frameAncestors: ["'none'"],
        },
      },
      crossOriginResourcePolicy: { policy: 'same-site' },
      referrerPolicy: { policy: 'no-referrer' },
    }),
  );

  app.enableCors({
    origin: config.app.corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
    exposedHeaders: ['x-request-id'],
    maxAge: 86_400,
  });

  app.use((await import('express')).json({ limit: MAX_REQUEST_BODY_BYTES }));
  app.use(
    (await import('express')).urlencoded({
      extended: false,
      limit: MAX_REQUEST_BODY_BYTES,
    }),
  );

  // Behind a load balancer, `req.ip` must reflect the client rather than the proxy, or
  // rate limiting keys every request to the same address.
  app.set('trust proxy', 1);

  app.setGlobalPrefix(API_GLOBAL_PREFIX);
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: API_VERSION });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // Unknown properties are rejected rather than stripped. Silently dropping a
      // misspelled field lets a client believe it set something it did not.
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );

  app.enableShutdownHooks();

  if (config.app.swaggerEnabled) {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('BlueRise Workforce API')
        .setDescription(
          'The BlueRise Workforce platform API. Phase 1 exposes health endpoints only; ' +
            'later phases add contact, authentication, workforce, payroll, benefits, ' +
            'timekeeping, HR/compliance, and workers’ compensation modules.',
        )
        .setVersion(config.app.version)
        .addBearerAuth()
        .addServer(`/${API_GLOBAL_PREFIX}/v${API_VERSION}`)
        .build(),
    );
    SwaggerModule.setup(OPENAPI_PATH, app, document, {
      jsonDocumentUrl: `${OPENAPI_PATH}-json`,
      swaggerOptions: { persistAuthorization: true },
    });
  }

  await app.listen(config.app.port, config.app.host);

  const logger = app.get(PinoLogger);
  logger.log(
    `BlueRise Workforce API listening on http://${config.app.host}:${config.app.port}/${API_GLOBAL_PREFIX}/v${API_VERSION} (${config.app.environment})`,
  );
  if (config.app.swaggerEnabled) {
    logger.log(
      `OpenAPI document at http://${config.app.host}:${config.app.port}/${OPENAPI_PATH}`,
    );
  }
}

void bootstrap();
