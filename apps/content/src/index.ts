import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginInlineTraceDisabled } from '@apollo/server/plugin/disabled';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import resolvers from '@content/resolvers';
import { readFileSync } from 'fs';
import { gql } from 'graphql-tag';
import { join } from 'path';

(async () => {
  const port = process.env.PORT ?? 3000;

  const plugins = [];
  if (process.env.NODE_ENV === 'production') {
    plugins.push(ApolloServerPluginInlineTraceDisabled());
  }
  const schema = readFileSync(join(__dirname, 'graph/schema.graphql'), 'utf8');
  const typeDefs = gql`
    #graphql
    ${schema}
  `;

  const server = new ApolloServer({
    plugins,
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: Number(port) },
  });
  // eslint-disable-next-line no-console
  console.log(
    `Content Subgraph has successfully started and listening at ${url}`,
  );
})();
