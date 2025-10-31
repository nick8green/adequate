import { ApolloGateway, IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { existsSync, readFileSync, watch } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

class DefaultHeaderAppendage extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }: any) {
    request.http.headers.set('origin', context.origin);
    request.http.headers.set('x-gateway', 'adequate-gateway');
  }
}

const defaultConfig = {
  buildService: ({ name, url }: any) => new DefaultHeaderAppendage({ url }),
};

export const getGateway = () =>
  process.env.NODE_ENV === 'production'
    ? getProductionGateway()
    : getDevelopmentGateway();

const getDevelopmentGateway = () => {
  const config =
    process.env.SUBGRAPHS_CONFIG ?? join(__dirname, '../config/subgraphs.json');

  // check that the supergraph file exists
  if (!existsSync(config)) {
    throw new Error("supergraph file can't be found!");
  }

  return new ApolloGateway({
    ...defaultConfig,
    supergraphSdl: new IntrospectAndCompose({
      subgraphs: JSON.parse(readFileSync(config, 'utf-8')),
    }),
  });
};

const getProductionGateway = () => {
  const supergraphFile =
    process.env.SUPERGRAPH_FILE ??
    join(__dirname, '../config/supergraph.graphql');

  // check that the supergraph file exists
  if (!existsSync(supergraphFile)) {
    throw new Error("supergraph file can't be found!");
  }

  return new ApolloGateway({
    supergraphSdl: async ({ update, healthCheck }) => {
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
        cleanup: async () => {
          watcher.close();
        },
      };
    },
  });
};
