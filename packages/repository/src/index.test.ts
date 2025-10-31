import JsonClient from '@repository/clients/json';
import MySQLClient from '@repository/clients/mysql';
import { Client, client } from '@repository/index';

type ClientTestCase = {
  label: string;
  client: jest.Mock;
};
type FunctionTestCase = {
  args: any[];
  default?: any;
  error?: string;
  name: string;
};

jest.mock('@repository/clients/json', () => {
  return jest.fn().mockImplementation(() => ({
    init: jest.fn(),
    close: jest.fn(),
    isConnected: jest.fn().mockReturnValue(true),
    get: jest.fn(),
    add: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }));
});
jest.mock('@repository/clients/mysql', () => {
  return jest.fn().mockImplementation(() => ({
    init: jest.fn(),
    close: jest.fn(),
    isConnected: jest.fn().mockReturnValue(true),
    get: jest.fn(),
    add: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }));
});

describe('Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error for unsupported dialect on init', async () => {
    process.env.REPOSITORY_DIALECT = 'unsupported';

    await expect(client.init()).rejects.toThrow(
      'Unsupported repository dialect',
    );
  });

  const clients: ClientTestCase[] = [
    {
      client: JsonClient as jest.Mock,
      label: 'json',
    },
    {
      client: MySQLClient as jest.Mock,
      label: 'mysql',
    },
  ];
  const functions: FunctionTestCase[] = [
    { args: [], default: null, name: 'init' },
    { args: [], default: undefined, name: 'close' },
    { args: [], default: false, name: 'isConnected' },
    {
      args: ['key', {}],
      default: null,
      error: 'Client not initialized',
      name: 'get',
    },
    {
      args: ['key', { data: 'value' }],
      default: null,
      error: 'Client not initialized',
      name: 'add',
    },
    {
      args: ['key', { data: 'new value' }, {}],
      default: null,
      error: 'Client not initialized',
      name: 'update',
    },
    {
      args: ['key', {}],
      default: null,
      error: 'Client not initialized',
      name: 'delete',
    },
  ];

  for (const { label, client: MockClient } of clients) {
    describe(`${label} client`, () => {
      for (const { args, default: defaultValue, error, name } of functions) {
        it(`${name} should be called on the ${label} client`, async () => {
          process.env.REPOSITORY_DIALECT = label;

          if (name !== 'init') {
            await client.init();
          }
          await (client as any)[name](...args);

          const instance = MockClient.mock.results[0].value;
          if (args.length === 0) {
            expect(instance[name]).toHaveBeenCalled();
          } else {
            expect(instance[name]).toHaveBeenCalledWith(...args);
          }
        });

        if (error) {
          it(`${name} errors when no client is initialized`, async () => {
            const c = new Client();
            expect(() => (c as any)[name]('data')).toThrow(
              'Client not initialized',
            );
          });
        }

        if (defaultValue !== null) {
          it(`${name} returns ${defaultValue} when there is no client`, async () => {
            const c = new Client();
            const result = await (c as any)[name](...args);
            expect(result).toBe(defaultValue);
          });
        }
      }
    });
  }
});
