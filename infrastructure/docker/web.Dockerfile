# syntax=docker/dockerfile:1.7
#
# BlueRise Workforce web application.
#
# Built from the repository root:
#   docker build -f infrastructure/docker/web.Dockerfile .

# ----------------------------------------------------------------------------------------
# Build
# ----------------------------------------------------------------------------------------
FROM node:22.23-alpine AS build
WORKDIR /repo

COPY package.json package-lock.json ./
COPY packages/shared-config/package.json packages/shared-config/
COPY packages/shared-types/package.json packages/shared-types/
COPY packages/ui/package.json packages/ui/
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/

RUN npm ci --workspace @bluerise/web --workspace @bluerise/shared-config \
    --workspace @bluerise/shared-types --include-workspace-root

COPY packages packages
COPY apps/web apps/web

RUN npm run build --workspace @bluerise/shared-config \
 && npm run build --workspace @bluerise/shared-types \
 && npm run build --workspace @bluerise/web

# ----------------------------------------------------------------------------------------
# Runtime
# ----------------------------------------------------------------------------------------
FROM nginx:1.27-alpine AS runtime

COPY infrastructure/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/apps/web/dist/bluerise-web/browser /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=4s --start-period=5s --retries=3 \
  CMD wget --quiet --spider http://127.0.0.1:8080/ || exit 1
