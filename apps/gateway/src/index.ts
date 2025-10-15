import { ApolloServer } from '@apollo/server';
import { ApolloServerErrorCode } from '@apollo/server/errors';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@as-integrations/express5';
import { getGateway } from '@gateway/gateway';
import { express as serveMetrics } from '@shared/metrics/serve';
import { cors } from '@shared/middleware/cors';
import express from 'express';
import type { GraphQLFormattedError } from 'graphql';
import http from 'http';

interface Context {
  token?: string;
}

(async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const port = process.env.PORT ?? 4000;

  app.use(cors);
  app.use(express.json());

  // Create a new Apollo Server instance with the Apollo Gateway
  const server = new ApolloServer<Context>({
    formatError: (formattedError: GraphQLFormattedError) => {
      // eslint-disable-next-line no-console
      console.error(
        `${formattedError.message} [code: ${formattedError.extensions?.code}] [source: ${formattedError.extensions?.serviceName}] [stack: ${formattedError.extensions?.stacktrace}]`,
      );
      return {
        message: formattedError.message,
        code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
      };
    },
    gateway: getGateway(),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => ({
        origin: req.headers.origin,
        token: req.headers.token,
      }),
    }),
  );

  app.get('/status', (req, res) => {
    const now = new Date();

    res.status(200).json({
      adapters: {},
      currentTime: now.toISOString(),
      description: 'application is up and running',
      status: 'UP',
      startTime: new Date(
        now.getTime() - process.uptime() * 1000,
      ).toISOString(),
      switches: {},
      uptime: process.uptime(),
      version: process.env.VERSION ?? 'development',
    });
  });

  app.get('/metrics', serveMetrics);

  httpServer.listen({ port }, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
  });
})();
