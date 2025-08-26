ARG NODE_VERSION=24

FROM ghcr.io/nick8green/node:${NODE_VERSION} AS builder

WORKDIR /app

COPY apps/content /app/apps/content
COPY packages /app/packages
COPY package.json /app/package.json
COPY tsconfig.json /app/tsconfig.json
COPY yarn.lock /app/yarn.lock

RUN yarn install --frozen-lockfile --ignore-scripts && \
    yarn workspace content-service build && \
    yarn install --frozen-lockfile --ignore-scripts --production

FROM node:${NODE_VERSION}-alpine AS production

ARG VERSION=development

ENV VERSION=${VERSION}
ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/apps/content/dist ./dist

RUN addgroup --system app && \
    adduser --disabled-password --gecos '' --system --ingroup app app

USER app

EXPOSE 3000

CMD ["node", "dist/index.js"]
