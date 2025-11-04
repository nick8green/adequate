ARG NODE_VERSION=24

FROM ghcr.io/nick8green/node:${NODE_VERSION} AS builder

WORKDIR /app

COPY apps/gateway /app/apps/gateway
COPY packages /app/packages
COPY package.json /app/package.json
COPY tsconfig.json /app/tsconfig.json
COPY yarn.lock /app/yarn.lock

RUN yarn install --frozen-lockfile --ignore-scripts && \
    yarn workspace gateway build && \
    yarn install --frozen-lockfile --ignore-scripts --production

# Build the supergraph
FROM ghcr.io/nick8green/rover:24.10.0-22.04 AS supergraph

COPY ./apps /app/apps

WORKDIR /app/apps/gateway

ENV APOLLO_ELV2_LICENSE=accept

RUN rover supergraph compose --config ./supergraph.yaml --output ./supergraph.graphql

# Production stage
FROM node:${NODE_VERSION}-alpine AS production

ARG VERSION=development

ENV VERSION=${VERSION}
ENV NODE_ENV=production

WORKDIR /app

COPY ./apps/gateway/docker-entrypoint.sh /app/docker-entrypoint.sh
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/apps/gateway/dist /app/dist
COPY --from=supergraph /app/apps/gateway/supergraph.graphql /app/config/supergraph.graphql

RUN chmod +x /app/docker-entrypoint.sh && \
    addgroup --system app && \
    adduser --disabled-password --gecos '' --system --ingroup app app

USER app

EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]
