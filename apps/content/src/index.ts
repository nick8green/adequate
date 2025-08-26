import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginInlineTraceDisabled } from '@apollo/server/plugin/disabled';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { expressMiddleware } from '@as-integrations/express5';
import resolvers from '@content/resolvers';
import { cors } from '@shared/middleware/cors';
import express from 'express';
import { readFileSync } from 'fs';
import { gql } from 'graphql-tag';
import helmet from 'helmet';
import http from 'http';
import { join } from 'path';
import { endpoint as statusEndpoint } from '@shared/routes/status';
import { express as serveMetrics } from '@shared/metrics/serve';

interface Context {
  token?: string;
}

(async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const port = process.env.PORT ?? 3000;

  app.use(helmet());
  app.use(cors);
  app.use(express.json());

  const plugins = [ApolloServerPluginDrainHttpServer({ httpServer })];
  if (process.env.NODE_ENV === 'production') {
    plugins.push(ApolloServerPluginInlineTraceDisabled());
  }
  const schema = readFileSync(join(__dirname, 'graph/schema.graphql'), 'utf8');
  const typeDefs = gql`
    #graphql
    ${schema}
  `;

  console.debug('Apollo Server starting...');
  const server = new ApolloServer<Context>({
    introspection: process.env.NODE_ENV !== 'production',
    plugins,
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
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
