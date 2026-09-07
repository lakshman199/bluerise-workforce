import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Node decides whether a .js file is CommonJS or ESM from the nearest package.json, and
 * this package's own package.json cannot declare both. Writing a marker into each output
 * directory is what makes the dual build resolve correctly under Node as well as under a
 * bundler.
 */
const distRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');

for (const [directory, type] of [
  ['cjs', 'commonjs'],
  ['esm', 'module'],
]) {
  const target = resolve(distRoot, directory);
  mkdirSync(target, { recursive: true });
  writeFileSync(
    resolve(target, 'package.json'),
    `${JSON.stringify({ type }, null, 2)}\n`,
  );
}
