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

COPY --from=builder /app/apps/app/.next .next
COPY --from=builder /app/apps/app/public public
COPY --from=builder /app/apps/app/package.json .
COPY --from=builder /app/node_modules node_modules

RUN addgroup --system app && \
    adduser --disabled-password --gecos '' --system --ingroup app app && \
    rm -rf /tmp/* /var/cache/apk/*

USER app

EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]