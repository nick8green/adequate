/**
 * @jest-environment node
 */

import { getRateLimiter } from '@shared/rateLimit/distributed';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

jest.mock('@upstash/redis');
jest.mock('@upstash/ratelimit');

const mockRedis = Redis as jest.MockedClass<typeof Redis>;
const mockRatelimit = Ratelimit as jest.Mocked<typeof Ratelimit>;

describe('getRateLimiter', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...OLD_ENV,
      REDIS_REST_URL: 'redis-url',
      REDIS_REST_TOKEN: 'redis-token',
    };
    mockRatelimit.fixedWindow = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (mockRatelimit as any).mockImplementation(function (this: any, opts: any) {
      Object.assign(this, opts);
    });
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('creates Redis instance with env vars', () => {
    getRateLimiter(10, 10);
    expect(mockRedis).toHaveBeenCalledWith({
      url: 'redis-url',
      token: 'redis-token',
    });
  });

  it('uses seconds when < 60', () => {
    mockRatelimit.fixedWindow.mockReturnValue('limiter');
    const limiter = getRateLimiter(5, 30);
    expect(mockRatelimit.fixedWindow).toHaveBeenCalledWith(5, '30s');
    expect(limiter.limiter).toBe('limiter');
  });

  it('uses minutes when seconds >= 60 seconds and < 1 hour', () => {
    mockRatelimit.fixedWindow.mockReturnValue('limiter');
    const limiter = getRateLimiter(10, 60 * 2); // 2 minutes
    expect(mockRatelimit.fixedWindow).toHaveBeenCalledWith(10, '2m');
    expect(limiter.limiter).toBe('limiter');
  });

  it('uses hours when seconds >= 1 hour and < 24 hours', () => {
    mockRatelimit.fixedWindow.mockReturnValue('limiter');
    const limiter = getRateLimiter(20, 60 * 60 * 2); // 2 hours
    expect(mockRatelimit.fixedWindow).toHaveBeenCalledWith(20, '2h');
    expect(limiter.limiter).toBe('limiter');
  });

  it('uses days when seconds >= 24 hours', () => {
    mockRatelimit.fixedWindow.mockReturnValue('limiter');
    const limiter = getRateLimiter(50, 60 * 60 * 48); // 2 days
    expect(mockRatelimit.fixedWindow).toHaveBeenCalledWith(50, '2d');
    expect(limiter.limiter).toBe('limiter');
  });

  it('enables analytics', () => {
    mockRatelimit.fixedWindow.mockReturnValue('limiter');
    const limiter = getRateLimiter(1, 1);
    expect(limiter.analytics).toBe(true);
  });
});
