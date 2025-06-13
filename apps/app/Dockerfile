ARG NODE_VERSION=24

FROM ghcr.io/nick8green/node:${NODE_VERSION} AS builder

WORKDIR /app

COPY . .

RUN yarn install && \
    yarn workspace app build && \
    yarn --frozen-lockfile --production

FROM node:${NODE_VERSION}-alpine

ARG VERSION=development

ENV VERSION=${VERSION}
ENV NODE_ENV=production

WORKDIR /app

ENV TOKENS_DIR=/tokens
ENV STYLES_DIR=/app/public/styles

COPY --from=builder /app/apps/app/.next .next
COPY --from=builder /app/apps/app/public public
COPY --from=builder /app/apps/app/package.json .
COPY --from=builder /app/node_modules node_modules
COPY ./tools/designs /tools/designs

COPY apps/app/docker-entrypoint.sh /

RUN addgroup --system app && adduser --system --ingroup app app && \
    chmod +x /docker-entrypoint.sh && \
    chown -R app:app /app/public/styles

USER app

EXPOSE 3000

ENTRYPOINT ["/bin/sh", "/docker-entrypoint.sh"]
