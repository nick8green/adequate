# Define the node version
ARG NODE_VERSION=21.5

# Build the app
FROM node:$NODE_VERSION AS builder

ARG ENV=production

WORKDIR /build

ENV APP_ENV=$ENV

COPY . .

RUN npm ci

# RUN snyk test
RUN npm run build

# Build into the usable image
FROM node:$NODE_VERSION-alpine AS server

ARG ENV=production

# Copy to the compiled files
COPY --from=builder /build/public /app/public
COPY --from=builder /build/.next /app/.next
COPY --from=builder /build/node_modules /app/node_modules
COPY --from=builder /build/package.json /app/package.json

EXPOSE 3000

RUN addgroup -S appgroup
RUN adduser -S appuser -G appgroup
USER appuser

WORKDIR /app

CMD [ "npm", "start" ]