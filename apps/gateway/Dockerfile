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
FROM ghcr.io/nick8green/node:${NODE_VERSION} AS supergraph

WORKDIR /app

COPY apps/gateway /app/apps/gateway
COPY packages /app/packages
COPY package.json /app/package.json
COPY tsconfig.json /app/tsconfig.json
COPY yarn.lock /app/yarn.lock

# Purely for development purposes at this stage
RUN touch /app/apps/gateway/config/supergraph.graphql || true
# RUN yarn install --frozen-lockfile --ignore-scripts --production && \
#     yarn workspace gateway supergraph:build

# Production stage
FROM node:${NODE_VERSION}-alpine AS production

ARG VERSION=development

ENV VERSION=${VERSION}
ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/apps/gateway/dist ./dist
COPY --from=supergraph /app/apps/gateway/config/supergraph.graphql /app/config/supergraph.graphql

RUN addgroup --system app && \
    adduser --disabled-password --gecos '' --system --ingroup app app

USER app

EXPOSE 3000

ENTRYPOINT ["/bin/sh", "/docker-entrypoint.sh"]
