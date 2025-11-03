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

export const getBrowserClient = (): BrowserApolloClient => {
  if (browserClientInstance) {
    return browserClientInstance;
  }

  if (globalThis.window === undefined) {
    console.warn('using mock browser Apollo client in non-browser environment');
    return new BrowserApolloClient({
      link: new HttpLink({
        uri: '/mock',
        fetch: mockFetch,
      }),
      cache: new BrowserInMemoryCache(),
    });
  }

  if (!process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT) {
    throw new Error('missing graphql client side endpoint');
  }

  browserClientInstance = new BrowserApolloClient({
    link: new HttpLink({
      uri: `${process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT}/graphql`,
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

export const getServerClient = (): ServerApolloClient => {
  if (serverClientInstance) {
    return serverClientInstance;
  }

  const isBuild =
    globalThis.window === undefined && process.env.NODE_ENV === 'production';
  if (!process.env.GRAPHQL_ENDPOINT && !isBuild) {
    throw new Error('missing graphql server side endpoint');
  }

  serverClientInstance = new ServerApolloClient({
    ssrMode: true,
    link: new HttpLink({
      fetch: isBuild ? mockFetch : fetch,
      uri: `${process.env.GRAPHQL_ENDPOINT}/graphql`,
    }),
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

const mockFetch = async () => {
  return new Response(
    JSON.stringify({
      data: {
        footer: {
          pages: [],
        },
        header: {
          pages: [],
        },
        pages: {
          pages: [],
        },
      },
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  );
};
