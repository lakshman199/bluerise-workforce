#!/bin/sh
#
# Applies pending migrations before the server accepts traffic, so an instance never serves
# requests against a schema it does not expect.
#
# With more than one instance starting at once, TypeORM takes a Postgres advisory lock
# around the migration run; the losers wait and then find nothing pending.
set -eu

if [ "${RUN_MIGRATIONS_ON_START:-true}" = "true" ]; then
  echo "[entrypoint] Applying database migrations..."
  npm run migration:run --workspace @bluerise/api
  echo "[entrypoint] Migrations complete."
else
  echo "[entrypoint] RUN_MIGRATIONS_ON_START is not 'true'; skipping migrations."
fi

exec "$@"
