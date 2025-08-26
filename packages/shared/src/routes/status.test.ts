import * as headers from 'next/headers';

import {
  checkBackend,
  // getAdapters,
  getServiceStatus,
  getSwitches,
  getUptime,
} from './status';

jest.mock('next/headers', () => ({
  cookies: jest.fn().mockReturnValue({
    getAll: jest.fn(() => [
      { name: 'switch_featureA', value: 'true' },
      { name: 'switch_featureB', value: 'false' },
    ]),
  }),
}));
jest.mock('next/server', () => ({
  NextResponse: class {
    constructor(
      public body: string,
      public options: object,
    ) {}
  },
}));
jest.mock('@shared/metrics/withMetrics', () => ({
  withMetrics: (fn: any) => fn, //eslint-disable-line @typescript-eslint/no-explicit-any
}));

beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2025-07-14T23:32:00Z'));
});

afterAll(() => {
  jest.useRealTimers();
});

describe('status module', () => {
  describe('checkBackend', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...OLD_ENV };
      global.fetch = jest.fn();
    });

    afterEach(() => {
      process.env = OLD_ENV;
      jest.clearAllMocks();
    });

    it('returns UP if BACKEND_URL is not set', async () => {
      delete process.env.BACKEND_URL;
      const result = await checkBackend();
      expect(result).toEqual({
        description: 'no system specified',
        name: 'backend',
        status: 'UP',
      });
    });

    it('returns UP if backend responds with 200', async () => {
      process.env.BACKEND_URL = 'https://test/graphql';
      (global.fetch as jest.Mock).mockResolvedValue({
        status: 200,
        ok: true,
      });
      const result = await checkBackend();
      expect(result.status).toBe('UP');
      expect(result.name).toBe('graphql');
      expect(result.description).toBe('backend is up and running');
    });

    it('returns DOWN if backend responds with non-200', async () => {
      process.env.BACKEND_URL = 'https://test/rest';
      (global.fetch as jest.Mock).mockResolvedValue({
        status: 500,
        ok: false,
        statusText: 'Internal Server Error',
      });
      const result = await checkBackend();
      expect(result.status).toBe('DOWN');
      expect(result.name).toBe('rest');
      expect(result.description).toBe('backend is down');
    });

    it('returns DOWN if fetch throws', async () => {
      process.env.BACKEND_URL = 'https://test/rest';
      (global.fetch as jest.Mock).mockRejectedValue(new Error('fail'));
      const result = await checkBackend();
      expect(result.status).toBe('DOWN');
      expect(result.description).toBe('backend is down');
    });
  });

  describe('getAdapters', () => {
    beforeEach(() => {
      jest.resetModules(); // ensure clean slate
      jest.clearAllMocks();

      jest.doMock('./status', () => {
        const actual = jest.requireActual('./status');
        return {
          ...actual,
          checkBackend: jest.fn().mockResolvedValue({
            status: 'UP',
            description: 'desc',
            name: 'rest',
          }),
        };
      });
    });

    it('returns adapters with backend', async () => {
      const { getAdapters } = await import('./status');
      const adapters = await getAdapters();

      expect(adapters).toEqual({
        backend: {
          status: 'UP',
          description: 'desc',
          name: 'rest',
        },
      });
    });
  });

  describe('getServiceStatus', () => {
    const OLD_ENV = process.env;
    beforeEach(() => {
      process.env = { ...OLD_ENV };
      global.fetch = jest.fn();
    });
    afterEach(() => {
      process.env = OLD_ENV;
      jest.clearAllMocks();
    });

    it('returns DOWN if fetch fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('fail'));
      const [status, desc] = await getServiceStatus({});
      expect(status).toBe('DOWN');
      expect(desc).toBe('application is down');
    });

    it('returns DOWN if fetch returns non-200', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        status: 500,
        ok: false,
        text: async () => 'fail',
      });
      const [status, desc] = await getServiceStatus({});
      expect(status).toBe('DOWN');
      expect(desc).toBe('application is down');
    });

    it('returns UP if all adapters are UP', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        status: 200,
        ok: true,
      });
      const [status, desc] = await getServiceStatus({
        backend: { status: 'UP', description: '', name: 'rest' },
      });
      expect(status).toBe('UP');
      expect(desc).toBe('service is up and running');
    });

    it('returns DEGRADED if an adapter is DOWN', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        status: 200,
        ok: true,
      });
      const [status, desc] = await getServiceStatus({
        backend: { status: 'DOWN', description: '', name: 'rest' },
      });
      expect(status).toBe('DEGRADED');
      expect(desc).toMatch(/backend is down/);
    });

    it('returns DEGRADED if an adapter is in MAINTENANCE', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        status: 200,
        ok: true,
      });
      const [status, desc] = await getServiceStatus({
        backend: { status: 'MAINTENANCE', description: '', name: 'rest' },
      });
      expect(status).toBe('DEGRADED');
      expect(desc).toMatch(/backend is in maintenance/);
    });
  });

  describe('getSwitches', () => {
    it('returns switches from cookies', async () => {
      const cookiesMock = [
        { name: 'switch_featureA', value: 'true' },
        { name: 'switch_featureB', value: 'false' },
        { name: 'other_cookie', value: '123' },
      ];
      const getAll = jest.fn(() => cookiesMock);
      const cookiesFn = headers.cookies as jest.Mock;
      cookiesFn.mockReturnValue({ getAll });
      const switches = await getSwitches();
      expect(switches).toEqual([
        { name: 'featureA', value: 'on' },
        { name: 'featureB', value: 'off' },
      ]);
    });

    it('returns empty array if no switches', async () => {
      const getAll = jest.fn(() => []);
      const cookiesFn = headers.cookies as jest.Mock;
      cookiesFn.mockReturnValue({ getAll });
      const switches = await getSwitches();
      expect(switches).toEqual([]);
    });
  });

  describe('getUptime', () => {
    it('returns correct uptime tuple', () => {
      const now = new Date();
      const uptimeSec = 10;
      const oldUptime = process.uptime;
      process.uptime = () => uptimeSec;
      const [start, current, uptime] = getUptime();

      expect(new Date(start).getTime()).toBeGreaterThanOrEqual(
        now.getTime() - 10000,
      );
      expect(new Date(current).getTime()).toBeGreaterThanOrEqual(
        now.getTime() - 1000,
      );
      expect(uptime).toBe(uptimeSec);
      process.uptime = oldUptime;
    });

    it('returns correct uptime tuple (edge case: 0 uptime)', () => {
      const oldUptime = process.uptime;
      process.uptime = () => 0;
      const [start, current, uptime] = getUptime();
      expect(uptime).toBe(0);
      expect(new Date(current).getTime()).toBeGreaterThanOrEqual(
        new Date(start).getTime(),
      );
      process.uptime = oldUptime;
    });
  });

  describe('endpoint', () => {
    let originalFetch: typeof global.fetch;

    beforeEach(() => {
      originalFetch = global.fetch;
    });

    afterEach(() => {
      jest.clearAllMocks();
      global.fetch = originalFetch;
    });

    it('returns 200 and correct response on success', async () => {
      process.env.VERSION = '1.2.3';

      const { endpoint } = require('./status'); // eslint-disable-line @typescript-eslint/no-require-imports
      const handler = endpoint('/status');
      const res: any = await handler(); // eslint-disable-line @typescript-eslint/no-explicit-any

      expect(res.options.status).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.status).toBe('UP');
      expect(body.description).toBe('service is up and running');
      expect(body.version).toBe('1.2.3');
      expect(body.adapters).toEqual({
        backend: { status: 'UP', description: 'desc', name: 'rest' },
      });
      expect(body.switches).toEqual([
        { name: 'featureA', value: 'on' },
        { name: 'featureB', value: 'off' },
      ]);
      expect(res.options.headers['Content-Type']).toBe('application/json');
    });

    it('uses default version if VERSION env is not set', async () => {
      delete process.env.VERSION;
      const { endpoint } = await import('./status');
      const handler = endpoint('/status');
      const res: any = await handler(); // eslint-disable-line @typescript-eslint/no-explicit-any
      const body = JSON.parse(res.body);
      expect(body.version).toBe('development');
    });
  });
});
