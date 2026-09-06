import { validateEnvironment } from './environment.schema';

const baseEnv = {
  DATABASE_URL: 'postgresql://bluerise:secret@localhost:5432/bluerise_dev',
};

describe('validateEnvironment', () => {
  it('applies defaults when only the required variables are present', () => {
    const result = validateEnvironment({ ...baseEnv });

    expect(result.APP_ENV).toBe('development');
    expect(result.API_PORT).toBe(4300);
    expect(result.LOG_LEVEL).toBe('info');
  });

  it('rejects an environment with no database url', () => {
    expect(() => validateEnvironment({})).toThrow(/DATABASE_URL/);
  });

  it('coerces numeric variables from their string form', () => {
    const result = validateEnvironment({ ...baseEnv, API_PORT: '5555' });

    expect(result.API_PORT).toBe(5555);
    expect(typeof result.API_PORT).toBe('number');
  });

  it('rejects a port outside the valid range', () => {
    expect(() => validateEnvironment({ ...baseEnv, API_PORT: '70000' })).toThrow(
      /API_PORT/,
    );
  });

  it('rejects an unknown application environment', () => {
    expect(() => validateEnvironment({ ...baseEnv, APP_ENV: 'preprod' })).toThrow(
      /APP_ENV/,
    );
  });

  it('allows a wildcard cors origin in development', () => {
    const result = validateEnvironment({
      ...baseEnv,
      APP_ENV: 'development',
      CORS_ALLOWED_ORIGINS: '*',
    });

    expect(result.CORS_ALLOWED_ORIGINS).toBe('*');
  });

  it.each(['staging', 'production'])(
    'rejects a wildcard cors origin in %s',
    (appEnv) => {
      expect(() =>
        validateEnvironment({
          ...baseEnv,
          APP_ENV: appEnv,
          CORS_ALLOWED_ORIGINS: '*',
        }),
      ).toThrow(/CORS_ALLOWED_ORIGINS/);
    },
  );

  it('reports every problem at once rather than one per run', () => {
    let message = '';
    try {
      validateEnvironment({ API_PORT: 'not-a-port', LOG_LEVEL: 'chatty' });
    } catch (error) {
      message = (error as Error).message;
    }

    expect(message).toContain('API_PORT');
    expect(message).toContain('DATABASE_URL');
    expect(message).toContain('LOG_LEVEL');
  });

  it('lists problems in a stable order so the message is diffable', () => {
    const read = (env: Record<string, unknown>): string => {
      try {
        validateEnvironment(env);
      } catch (error) {
        return (error as Error).message;
      }
      throw new Error('Expected validation to fail.');
    };

    expect(read({ LOG_LEVEL: 'chatty', API_PORT: 'nope' })).toBe(
      read({ API_PORT: 'nope', LOG_LEVEL: 'chatty' }),
    );
  });
});
