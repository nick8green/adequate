import getDistrubutedRateLimiter from '@shared/rateLimit/distributed';
import getStaticRateLimiter from '@shared/rateLimit/static';

export { getIp } from '@shared/rateLimit/ip';

let rateLimit:
  | ReturnType<typeof getDistrubutedRateLimiter>
  | ReturnType<typeof getStaticRateLimiter>
  | null = null;

export const getLimiter = () => {
  const r = parseInt(process.env.REQUEST_LIMIT ?? '100');
  const t = parseInt(process.env.REQUEST_LIMIT_TIMEFRAME ?? '600');
  if (
    !rateLimit &&
    process.env.REDIS_REST_URL &&
    process.env.REDIS_REST_TOKEN
  ) {
    rateLimit = getDistrubutedRateLimiter(r, t);
  }
  rateLimit ??= getStaticRateLimiter(r, t);
  return rateLimit;
};

export const resetRateLimit = () => {
  rateLimit = null;
};

export default getLimiter;
