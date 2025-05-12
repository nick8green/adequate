ARG NODE_VERSION=24

FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

COPY . .
RUN npm install && npm run build

FROM node:${NODE_VERSION}-alpine

WORKDIR /app

COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/package.json .

RUN npm install --omit=dev

EXPOSE 3000
CMD ["npm", "start"]