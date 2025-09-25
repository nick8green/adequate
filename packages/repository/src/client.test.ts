import { Client } from '@repository/client';
import JsonClient from '@repository/clients/json';
import MySQLClient from '@repository/clients/mysql';

type MethodName = keyof typeof mockJsonInstance;

type FunctionTestCase = {
  name: MethodName;
  args: any[];
  default?: any;
  error?: string;
};

const createMockRepoClient = () => ({
  init: jest.fn(),
  close: jest.fn(),
  isConnected: jest.fn().mockReturnValue(true),
  get: jest.fn(),
  add: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  migrate: jest.fn(),
});

const mockJsonInstance = createMockRepoClient();
const mockMySQLInstance = createMockRepoClient();

jest.mock('@repository/clients/json', () => ({
  __esModule: true,
  default: {
    init: jest.fn().mockResolvedValue(mockJsonInstance),
  },
}));

jest.mock('@repository/clients/mysql', () => ({
  __esModule: true,
  default: {
    init: jest.fn().mockResolvedValue(mockMySQLInstance),
  },
}));

let client: Client;

describe('Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    client = new Client();
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.REPOSITORY_DIALECT;
    client = undefined as unknown as Client;
  });

  it('throws for unsupported dialect on init', async () => {
    process.env.REPOSITORY_DIALECT = 'unsupported';
    await expect(client.init()).rejects.toThrow(
      'Unsupported repository dialect',
    );
  });

  const dialects = ['json', 'mysql'];

  const functions: FunctionTestCase[] = [
    // { name: 'init', args: [], default: null },
    { name: 'close', args: [], default: undefined },
    { name: 'isConnected', args: [], default: false },
    {
      name: 'get',
      args: ['key', {}],
      default: null,
      error: 'Client not initialized',
    },
    {
      name: 'add',
      args: ['key', { data: 'value' }],
      default: null,
      error: 'Client not initialized',
    },
    {
      name: 'update',
      args: ['key', { data: 'new value' }, {}],
      default: null,
      error: 'Client not initialized',
    },
    {
      name: 'delete',
      args: ['key', {}],
      default: null,
      error: 'Client not initialized',
    },
    {
      name: 'migrate',
      args: [],
      default: null,
      error: 'Client not initialized',
    },
  ];

  for (const dialect of dialects) {
    describe(`${dialect} client`, () => {
      let mockInstance: ReturnType<typeof createMockRepoClient>;

      beforeEach(() => {
        process.env.REPOSITORY_DIALECT = dialect;
        mockInstance = createMockRepoClient();

        if (dialect === 'json') {
          (JsonClient.init as jest.Mock).mockResolvedValue(mockInstance);
        } else {
          (MySQLClient.init as jest.Mock).mockResolvedValue(mockInstance);
        }
      });

      for (const { name, args, default: defaultValue, error } of functions) {
        it(`${name} should call ${dialect} client method`, async () => {
          await client.init();
          await (client as any)[name](...args);

          const assertion =
            args.length === 0 ? 'toHaveBeenCalled' : 'toHaveBeenCalledWith';
          expect(mockInstance[name])[assertion](...(args ?? []));
        });

        if (error) {
          it(`${name} throws when no client is initialized`, async () => {
            const c = new Client();
            const result = (c as any)[name](...args);

            if (result instanceof Promise) {
              // eslint-disable-next-line jest/no-conditional-expect
              await expect(result).rejects.toThrow(error);
            } else {
              // eslint-disable-next-line jest/no-conditional-expect
              expect(() => result).toThrow(error);
            }
          });
        }

        if (defaultValue !== null) {
          it(`${name} returns ${defaultValue} when no client is initialized`, async () => {
            const c = new Client();
            const result = await (c as any)[name](...args);
            expect(result).toBe(defaultValue);
          });
        }
      }
    });
  }
});
