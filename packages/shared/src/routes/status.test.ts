// import cookies from 'next/headers';

import {
  checkBackend,
  // getAdapters,
  getSerivceStatus,
  // getSwitches,
  getUptime,
} from './status';

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));
jest.mock('next/server', () => ({
  NextResponse: class {
    constructor(
      public body: string,
      public init: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    ) {}
  },
}));
jest.mock('@shared/metrics/withMetrics', () => ({
  withMetrics: (fn: any) => fn, //eslint-disable-line @typescript-eslint/no-explicit-any
}));

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
    // it('returns adapters with backend', async () => {
    //     const backend = { status: 'UP', description: 'desc', name: 'rest' };
    //     jest.spyOn(require('./status'), 'checkBackend').mockResolvedValue(backend);
    //     const adapters = await getAdapters();
    //     expect(adapters).toEqual({ backend });
    // });
  });

  describe('getSerivceStatus', () => {
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
      const [status, desc] = await getSerivceStatus({});
      expect(status).toBe('DOWN');
      expect(desc).toBe('application is down');
    });

    it('returns DOWN if fetch returns non-200', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        status: 500,
        ok: false,
        text: async () => 'fail',
      });
      const [status, desc] = await getSerivceStatus({});
      expect(status).toBe('DOWN');
      expect(desc).toBe('application is down');
    });

    it('returns UP if all adapters are UP', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        status: 200,
        ok: true,
      });
      const [status, desc] = await getSerivceStatus({
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
      const [status, desc] = await getSerivceStatus({
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
      const [status, desc] = await getSerivceStatus({
        backend: { status: 'MAINTENANCE', description: '', name: 'rest' },
      });
      expect(status).toBe('DEGRADED');
      expect(desc).toMatch(/backend is in maintenance/);
    });
  });

  describe('getSwitches', () => {
    // it('returns switches from cookies', async () => {
    //     const cookiesMock = [
    //         { name: 'switch_featureA', value: 'true' },
    //         { name: 'switch_featureB', value: 'false' },
    //         { name: 'other_cookie', value: '123' },
    //     ];
    //     const getAll = jest.fn(() => cookiesMock);
    //     cookiesFn.mockReturnValue({ getAll });
    //     const switches = await getSwitches();
    //     expect(switches).toEqual([
    //         { name: 'featureA', value: 'on' },
    //         { name: 'featureB', value: 'off' },
    //     ]);
    // });
    // it('returns empty array if no switches', async () => {
    //     const getAll = jest.fn(() => []);
    //     cookiesFn.mockReturnValue({ getAll });
    //     const switches = await getSwitches();
    //     expect(switches).toEqual([]);
    // });
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
  });
});
