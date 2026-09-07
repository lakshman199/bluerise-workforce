import js from '@eslint/js';
import angular from 'angular-eslint';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/.angular/**',
      '**/coverage/**',
      '**/node_modules/**',
      'apps/api/test/**',
    ],
  },

  // -------------------------------------------------------------------------------------
  // Every TypeScript file in the monorepo
  // -------------------------------------------------------------------------------------
  {
    files: ['**/*.ts'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    rules: {
      // The specification forbids `any` unless it is genuinely necessary and documented.
      // An explicit `any` is a warning that a reviewer must justify; an implicit one is
      // already blocked by `strict` in tsconfig.
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      // Sensitive values must not reach a console. Structured logging is the only sanctioned
      // path, because that is where redaction is configured.
      'no-console': ['error', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'smart'],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },

  // -------------------------------------------------------------------------------------
  // NestJS: decorator metadata means constructor parameters are used by the framework even
  // when they look unused, and empty decorated classes are the normal module shape.
  // -------------------------------------------------------------------------------------
  {
    files: ['apps/api/**/*.ts'],
    rules: {
      '@typescript-eslint/no-extraneous-class': 'off',
      // Nest resolves constructor dependencies from `emitDecoratorMetadata`, and a type-only
      // import is erased before that metadata is written — the application then fails at
      // boot with "Nest can't resolve dependencies". ESLint cannot tell an injected
      // parameter from an ordinary type annotation, so the rule is off for the API rather
      // than left on with a suppression on every provider.
      '@typescript-eslint/consistent-type-imports': 'off',
    },
  },

  {
    files: ['**/*.spec.ts'],
    rules: {
      'no-console': 'off',
    },
  },

  // -------------------------------------------------------------------------------------
  // Angular components and directives
  // -------------------------------------------------------------------------------------
  {
    files: ['apps/web/**/*.ts'],
    extends: [...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'br', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'br', style: 'kebab-case' },
      ],
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',
      '@angular-eslint/prefer-standalone': 'error',
    },
  },

  // -------------------------------------------------------------------------------------
  // Angular templates. Accessibility rules are errors, not warnings: they are part of the
  // feature rather than a later enhancement.
  // -------------------------------------------------------------------------------------
  {
    files: ['apps/web/**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      '@angular-eslint/template/prefer-control-flow': 'error',
    },
  },

  prettier,
);
