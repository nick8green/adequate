import getDistributedRateLimiter from '@shared/rateLimit/distributed';
import getStaticRateLimiter from '@shared/rateLimit/static';

export { getIp } from '@shared/rateLimit/ip';

let rateLimit:
  | ReturnType<typeof getDistributedRateLimiter>
  | ReturnType<typeof getStaticRateLimiter>
  | null = null;

export const getLimiter = () => {
  if (rateLimit) {
    return rateLimit;
  }

  const r = parseInt(process.env.REQUEST_LIMIT ?? '100');
  const t = parseInt(process.env.REQUEST_LIMIT_TIMEFRAME ?? '600');

  if (r === 0 || t === 0) {
    return {
      limit: () => {
        // eslint-disable-next-line no-console
        console.debug(
          'Rate limiting is disabled. REQUEST_LIMIT and REQUEST_LIMIT_TIMEFRAME should be set.',
        );
        return { success: true };
      },
    };
  }

  // eslint-disable-next-line no-console
  console.log('============================================================');
  // eslint-disable-next-line no-console
  console.log('Request limit:', process.env.REQUEST_LIMIT);
  // eslint-disable-next-line no-console
  console.log('Request timeframe:', process.env.REQUEST_LIMIT_TIMEFRAME);
  // eslint-disable-next-line no-console
  console.log(`Rate limiter initialized: ${r} requests per ${t} seconds`);
  // eslint-disable-next-line no-console
  console.log('============================================================');

  if (process.env.REDIS_REST_URL && process.env.REDIS_REST_TOKEN) {
    rateLimit = getDistributedRateLimiter(r, t);
  }

  rateLimit ??= getStaticRateLimiter(r, t);
  return rateLimit;
};

export const resetRateLimit = () => {
  rateLimit = null;
};

export default getLimiter;
