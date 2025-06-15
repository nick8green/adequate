ARG NODE_VERSION=24

FROM ghcr.io/nick8green/node:${NODE_VERSION} AS app-builder

WORKDIR /app

COPY . .

RUN yarn install && \
    yarn workspace app build && \
    yarn --frozen-lockfile --production

FROM ghcr.io/nick8green/node:${NODE_VERSION} AS token-builder

WORKDIR /app

COPY . .

RUN yarn workspace docs install --frozen-lockfile --production

FROM node:${NODE_VERSION}-alpine

LABEL org.opencontainers.image.authors="Nick Green <nick@nick8green.co.uk>"
LABEL org.opencontainers.image.description="Adequate App is a web application that provides a user interface for the adequate web system."
LABEL org.opencontainers.image.source=https://github.com/nick8green/adequate/apps/app
LABEL org.opencontainers.image.title="Adequate App"

ARG VERSION=development

ENV VERSION=${VERSION}
ENV NODE_ENV=production

WORKDIR /app

ENV TOKENS_DIR=/tokens
ENV STYLES_DIR=/app/public/styles

COPY --from=app-builder /app/apps/app/.next .next
COPY --from=app-builder /app/apps/app/public public
COPY --from=app-builder /app/node_modules node_modules

COPY --from=token-builder /app/tools/designs/src /designs
COPY --from=token-builder /app/node_modules /designs/node_modules

COPY apps/app/docker-entrypoint.sh /

RUN addgroup --system app && \
    adduser --disabled-password --gecos '' --system --ingroup app app && \
    chmod +x /docker-entrypoint.sh && \
    chown -R app:app /app/public/styles && \
    rm -rf /tmp/* /var/cache/apk/*

USER app

EXPOSE 3000

ENTRYPOINT ["/bin/sh", "/docker-entrypoint.sh"]
