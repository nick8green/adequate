it.todo('rateLimit test');

// import { getLimiter, resetRateLimit } from '.';
// const getDistrubutedRateLimiter =
//   require('@shared/rateLimit/distributed').default;
// const getStaticRateLimiter = require('@shared/rateLimit/static').default;

// jest.mock('@shared/rateLimit/distributed', () => ({
//   __esModule: true,
//   default: jest.fn(() => ({ type: 'distributed' })),
// }));
// jest.mock('@shared/rateLimit/static', () => ({
//   __esModule: true,
//   default: jest.fn(() => ({ type: 'static' })),
// }));

// describe('rateLimit/limit', () => {
//   const OLD_ENV = process.env;

//   beforeEach(() => {
//     jest.clearAllMocks();
//     resetRateLimit();
//     process.env = { ...OLD_ENV };
//   });

//   afterAll(() => {
//     process.env = OLD_ENV;
//   });

//   it('uses distributed rate limiter if redis env vars are set', () => {
//     process.env.REDIS_REST_URL = 'redis://localhost';
//     process.env.REDIS_REST_TOKEN = 'token';
//     process.env.REQUEST_LIMIT = '42';
//     process.env.REQUEST_LIMIT_TIMEFRAME = '99';

//     const limiter = getLimiter();

//     expect(getDistrubutedRateLimiter).toHaveBeenCalledWith(42, 99);
//     expect(getStaticRateLimiter).not.toHaveBeenCalled();
//     expect(limiter).toEqual({ type: 'distributed' });
//   });

//   it('uses static rate limiter if redis env vars are not set', () => {
//     delete process.env.REDIS_REST_URL;
//     delete process.env.REDIS_REST_TOKEN;
//     process.env.REQUEST_LIMIT = '10';
//     process.env.REQUEST_LIMIT_TIMEFRAME = '20';

//     const limiter = getLimiter();

//     expect(getDistrubutedRateLimiter).not.toHaveBeenCalled();
//     expect(getStaticRateLimiter).toHaveBeenCalledWith(10, 20);
//     expect(limiter).toEqual({ type: 'static' });
//   });

//   it('uses default values if env vars are not set', () => {
//     delete process.env.REQUEST_LIMIT;
//     delete process.env.REQUEST_LIMIT_TIMEFRAME;
//     delete process.env.REDIS_REST_URL;
//     delete process.env.REDIS_REST_TOKEN;

//     getLimiter();

//     expect(getStaticRateLimiter).toHaveBeenCalledWith(100, 600);
//   });

//   it('caches the limiter instance', () => {
//     process.env.REDIS_REST_URL = 'redis://localhost';
//     process.env.REDIS_REST_TOKEN = 'token';

//     const limiter1 = getLimiter();
//     const limiter2 = getLimiter();

//     expect(limiter1).toBe(limiter2);
//     expect(getDistrubutedRateLimiter).toHaveBeenCalledTimes(1);
//   });

//   it('resetRateLimit clears the cached limiter', () => {
//     process.env.REDIS_REST_URL = 'redis://localhost';
//     process.env.REDIS_REST_TOKEN = 'token';

//     const limiter1 = getLimiter();
//     resetRateLimit();
//     const limiter2 = getLimiter();

//     expect(getDistrubutedRateLimiter).toHaveBeenCalledTimes(2);
//     expect(limiter1).not.toBe(limiter2);
//   });
// });
