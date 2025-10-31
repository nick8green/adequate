import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@as-integrations/express5';
import { getGateway } from '@gateway/gateway';
import { cors } from '@shared/middleware/cors';
import express from 'express';
import http from 'http';
import { express as serveMetrics } from '@shared/metrics/serve';

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
    gateway: getGateway(),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
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
