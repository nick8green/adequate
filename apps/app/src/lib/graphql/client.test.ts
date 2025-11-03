import { getBrowserClient, getServerClient } from './client';

jest.mock('@apollo/client', () => {
  return {
    ApolloClient: jest.fn().mockImplementation((config) => ({
      __type: 'ServerApolloClient',
      config,
    })),
    HttpLink: jest
      .fn()
      .mockImplementation((config) => ({ __type: 'HttpLink', config })),
    InMemoryCache: jest
      .fn()
      .mockImplementation(() => ({ __type: 'ServerInMemoryCache' })),
  };
});
jest.mock('@apollo/client-integration-nextjs', () => {
  return {
    ApolloClient: jest.fn().mockImplementation((config) => ({
      __type: 'BrowserApolloClient',
      config,
    })),
    InMemoryCache: jest
      .fn()
      .mockImplementation(() => ({ __type: 'BrowserInMemoryCache' })),
  };
});

describe('getBrowserClient', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    // Reset singleton
    // @ts-expect-error due to setting global value that doesn't exist
    global.browserClientInstance = null;
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('throws if NEXT_PUBLIC_GRAPHQL_ENDPOINT is missing', () => {
    delete process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;
    expect(() => getBrowserClient()).toThrow(
      'missing graphql client side endpoint',
    );
  });

  it('returns a BrowserApolloClient instance', () => {
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT = 'https://example.com';
    const client = getBrowserClient();
    expect(client.__type).toBe('BrowserApolloClient');
    expect(client.config.link.config.uri).toBe('https://example.com/graphql');
    expect(client.config.cache.__type).toBe('BrowserInMemoryCache');
  });

  it('returns the same instance on subsequent calls', () => {
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT = 'https://example.com';
    const client1 = getBrowserClient();
    const client2 = getBrowserClient();
    expect(client1).toBe(client2);
  });
});

describe('getServerClient', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    // Reset singleton
    // @ts-expect-error due to setting global value that doesn't exist
    global.serverClientInstance = null;
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('throws if GRAPHQL_ENDPOINT is missing', () => {
    delete process.env.GRAPHQL_ENDPOINT;
    expect(() => getServerClient()).toThrow(
      'missing graphql server side endpoint',
    );
  });

  it('returns a ServerApolloClient instance', () => {
    process.env.GRAPHQL_ENDPOINT = 'https://example.com/server';
    const client = getServerClient();
    expect(client.__type).toBe('ServerApolloClient');
    expect(client.config.ssrMode).toBe(true);
    expect(client.config.link.config.uri).toBe(
      'https://example.com/server/graphql',
    );
    expect(client.config.cache.__type).toBe('ServerInMemoryCache');
  });

  it('returns the same instance on subsequent calls', () => {
    process.env.GRAPHQL_ENDPOINT = 'https://example.com/server';
    const client1 = getServerClient();
    const client2 = getServerClient();
    expect(client1).toBe(client2);
  });
});
