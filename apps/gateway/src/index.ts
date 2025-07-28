import { ApolloGateway } from '@apollo/gateway';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { watch } from 'fs';
import { readFile } from 'fs/promises';

(async () => {
  const port = process.env.PORT ?? 4000;
  const supergraphFile = process.env.SUPERGRAPH_FILE ?? './supergraph.graphql';

  // Create a new Apollo Server instance with the Apollo Gateway
  const server = new ApolloServer({
    gateway: new ApolloGateway({
      async supergraphSdl({ update, healthCheck }) {
        // create a file watcher
        const watcher = watch(supergraphFile);
        // subscribe to file changes
        watcher.on('change', async () => {
          // update the supergraph schema
          try {
            const updatedSupergraph = await readFile(supergraphFile, 'utf-8');
            // optional health check update to ensure our services are responsive
            await healthCheck(updatedSupergraph);
            // update the supergraph schema
            update(updatedSupergraph);
          } catch (e) {
            // handle errors that occur during health check or while updating the supergraph schema
            // eslint-disable-next-line no-console
            console.error(e);
          }
        });

        return {
          supergraphSdl: await readFile(supergraphFile, 'utf-8'),
          // cleanup is called when the gateway is stopped
          async cleanup() {
            watcher.close();
          },
        };
      },
    }),
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: Number(port) },
  });
  // eslint-disable-next-line no-console
  console.log(`🚀  Server ready at ${url}`);
})();
