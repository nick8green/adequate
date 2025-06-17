ARG NODE_VERSION=24

FROM ghcr.io/nick8green/node:${NODE_VERSION} AS builder

WORKDIR /app

COPY . .

RUN yarn config set network-timeout 600000 && \
    yarn install --frozen-lockfile && \
    yarn workspace app build && \
    yarn --frozen-lockfile --production

FROM ghcr.io/nick8green/node:${NODE_VERSION} AS token-builder

WORKDIR /app

COPY . .
COPY --from=builder /app/node_modules /app/node_modules

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

COPY --from=builder /app/apps/app/.next .next
COPY --from=builder /app/apps/app/public public
COPY --from=builder /app/node_modules node_modules

COPY --from=builder /app/tools/designs/src /app/designs

COPY apps/app/docker-entrypoint.sh /

RUN addgroup --system app && \
    adduser --disabled-password --gecos '' --system --ingroup app app && \
    chmod +x /docker-entrypoint.sh && \
    chown -R app:app /app/public/styles && \
    rm -rf /tmp/* /var/cache/apk/*

USER app

EXPOSE 3000

ENTRYPOINT ["/bin/sh", "/docker-entrypoint.sh"]
