import {
  ApolloClient as ServerApolloClient,
  HttpLink,
  InMemoryCache as ServerInMemoryCache,
} from '@apollo/client';
import {
  ApolloClient as BrowserApolloClient,
  InMemoryCache as BrowserInMemoryCache,
} from '@apollo/client-integration-nextjs';

let browserClientInstance: BrowserApolloClient | null = null;
let serverClientInstance: ServerApolloClient | null = null;

export const getBrowserClient = () => {
  if (browserClientInstance) {
    return browserClientInstance;
  }

  if (!process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT) {
    throw new Error('missing graphql client side endpoint');
  }

  browserClientInstance = new BrowserApolloClient({
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
      credentials: 'same-origin',
    }),
    cache: new BrowserInMemoryCache(),
  });

  setInterval(
    () => {
      browserClientInstance?.clearStore();
    },
    5 * 60 * 1000,
  ); // 5 minutes

  return browserClientInstance;
};

export const getServerClient = () => {
  if (serverClientInstance) {
    return serverClientInstance;
  }

  if (!process.env.GRAPHQL_ENDPOINT) {
    throw new Error('missing graphql server side endpoint');
  }

  serverClientInstance = new ServerApolloClient({
    ssrMode: true,
    link: new HttpLink({ uri: process.env.GRAPHQL_ENDPOINT }),
    cache: new ServerInMemoryCache(),
  });

  setInterval(
    () => {
      serverClientInstance?.clearStore();
    },
    5 * 60 * 1000,
  ); // 5 minutes

  return serverClientInstance;
};
