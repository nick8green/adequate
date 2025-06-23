import { getRateLimiter } from '@shared/rateLimit/static';

describe('getRateLimiter', () => {
  const ip = '127.0.0.1';

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(0);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('allows requests up to the limit', async () => {
    const limiter = getRateLimiter(3, 10);

    expect(await limiter.limit(ip)).toEqual({ success: true });
    expect(await limiter.limit(ip)).toEqual({ success: true });
    expect(await limiter.limit(ip)).toEqual({ success: true });
  });

  it('blocks requests over the limit', async () => {
    const limiter = getRateLimiter(2, 10);

    expect(await limiter.limit(ip)).toEqual({ success: true });
    expect(await limiter.limit(ip)).toEqual({ success: true });
    expect(await limiter.limit(ip)).toEqual({ success: false });
    expect(await limiter.limit(ip)).toEqual({ success: false });
  });

  it('resets the limit after the window expires', async () => {
    const limiter = getRateLimiter(2, 5);

    expect(await limiter.limit(ip)).toEqual({ success: true });
    expect(await limiter.limit(ip)).toEqual({ success: true });
    expect(await limiter.limit(ip)).toEqual({ success: false });

    // Advance time past the window
    jest.advanceTimersByTime(5001);

    expect(await limiter.limit(ip)).toEqual({ success: true });
    expect(await limiter.limit(ip)).toEqual({ success: true });
    expect(await limiter.limit(ip)).toEqual({ success: false });
  });

  it('tracks limits separately for different IPs', async () => {
    const limiter = getRateLimiter(1, 10);

    expect(await limiter.limit('1.1.1.1')).toEqual({ success: true });
    expect(await limiter.limit('1.1.1.1')).toEqual({ success: false });

    expect(await limiter.limit('2.2.2.2')).toEqual({ success: true });
    expect(await limiter.limit('2.2.2.2')).toEqual({ success: false });
  });

  it('resets count if window expires between requests', async () => {
    const limiter = getRateLimiter(2, 2);

    expect(await limiter.limit(ip)).toEqual({ success: true });
    jest.advanceTimersByTime(2100);
    expect(await limiter.limit(ip)).toEqual({ success: true });
    expect(await limiter.limit(ip)).toEqual({ success: true });
    expect(await limiter.limit(ip)).toEqual({ success: false });
  });
});
