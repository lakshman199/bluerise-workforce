import { buildConfiguration } from './configuration';
import { validateEnvironment } from './environment.schema';

const baseEnv = {
  DATABASE_URL: 'postgresql://bluerise:secret@localhost:5432/bluerise_dev',
};

describe('buildConfiguration', () => {
  it('splits the cors allowlist into trimmed origins', () => {
    const config = buildConfiguration(
      validateEnvironment({
        ...baseEnv,
        CORS_ALLOWED_ORIGINS: 'http://localhost:4200, https://app.example.com ,',
      }),
    );

    expect(config.app.corsOrigins).toEqual([
      'http://localhost:4200',
      'https://app.example.com',
    ]);
  });

  it.each(['staging', 'production'])(
    'refuses to publish the openapi document in %s even when the flag is on',
    (appEnv) => {
      const config = buildConfiguration(
        validateEnvironment({
          ...baseEnv,
          APP_ENV: appEnv,
          SWAGGER_ENABLED: 'true',
          CORS_ALLOWED_ORIGINS: 'https://app.example.com',
        }),
      );

      expect(config.app.swaggerEnabled).toBe(false);
    },
  );

  it('publishes the openapi document in development', () => {
    const config = buildConfiguration(
      validateEnvironment({ ...baseEnv, SWAGGER_ENABLED: 'true' }),
    );

    expect(config.app.swaggerEnabled).toBe(true);
  });

  it('disables pretty logging outside development regardless of the flag', () => {
    const config = buildConfiguration(
      validateEnvironment({
        ...baseEnv,
        APP_ENV: 'production',
        LOG_PRETTY: 'true',
        CORS_ALLOWED_ORIGINS: 'https://app.example.com',
      }),
    );

    expect(config.logging.pretty).toBe(false);
  });
});
