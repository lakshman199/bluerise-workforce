# syntax=docker/dockerfile:1.7
#
# BlueRise Workforce API.
#
# Built from the repository root so the workspace packages the API depends on
# (@bluerise/shared-config, @bluerise/shared-types) are available:
#   docker build -f infrastructure/docker/api.Dockerfile .

# ----------------------------------------------------------------------------------------
# Dependencies
# ----------------------------------------------------------------------------------------
FROM node:22.23-alpine AS deps
WORKDIR /repo

# Only the manifests, so this layer is reused whenever source changes but dependencies
# do not.
COPY package.json package-lock.json ./
COPY packages/shared-config/package.json packages/shared-config/
COPY packages/shared-types/package.json packages/shared-types/
COPY packages/ui/package.json packages/ui/
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/

RUN npm ci --workspace @bluerise/api --workspace @bluerise/shared-config \
    --workspace @bluerise/shared-types --include-workspace-root

# ----------------------------------------------------------------------------------------
# Build
# ----------------------------------------------------------------------------------------
FROM deps AS build
WORKDIR /repo

COPY packages/shared-config packages/shared-config
COPY packages/shared-types packages/shared-types
COPY apps/api apps/api

RUN npm run build --workspace @bluerise/shared-config \
 && npm run build --workspace @bluerise/shared-types \
 && npm run build --workspace @bluerise/api

# ----------------------------------------------------------------------------------------
# Runtime
# ----------------------------------------------------------------------------------------
FROM node:22.23-alpine AS runtime
WORKDIR /repo

ENV NODE_ENV=production

# Tini reaps zombies and forwards signals, so SIGTERM reaches Node and the shutdown hooks
# actually run instead of the container being killed after the grace period.
RUN apk add --no-cache tini

COPY --from=build /repo/package.json /repo/package-lock.json ./
COPY --from=build /repo/packages/shared-config/package.json packages/shared-config/
COPY --from=build /repo/packages/shared-config/dist packages/shared-config/dist
COPY --from=build /repo/packages/shared-types/package.json packages/shared-types/
COPY --from=build /repo/packages/shared-types/dist packages/shared-types/dist
COPY --from=build /repo/apps/api/package.json apps/api/
COPY --from=build /repo/apps/api/dist apps/api/dist
COPY --from=build /repo/apps/api/src/database apps/api/src/database

RUN npm ci --omit=dev --workspace @bluerise/api --include-workspace-root \
 && npm cache clean --force

COPY infrastructure/docker/api-entrypoint.sh /usr/local/bin/api-entrypoint.sh
RUN chmod +x /usr/local/bin/api-entrypoint.sh

USER node
EXPOSE 4300

# The liveness route never touches the database, so a database outage does not cause a
# healthy container to be restarted.
HEALTHCHECK --interval=30s --timeout=4s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.API_PORT||4300)+'/api/v1/health/live').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["/sbin/tini", "--", "/usr/local/bin/api-entrypoint.sh"]
CMD ["node", "apps/api/dist/main.js"]
