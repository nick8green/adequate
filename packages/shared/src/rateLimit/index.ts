import getDistrubutedRateLimiter from '@shared/rateLimit/distributed';
import getStaticRateLimiter from '@shared/rateLimit/static';

export { getIp } from '@shared/rateLimit/ip';

let rateLimit:
  | ReturnType<typeof getDistrubutedRateLimiter>
  | ReturnType<typeof getStaticRateLimiter>
  | null = null;

export const getLimiter = (requests: number = 100, seconds: number = 600) => {
  if (
    !rateLimit &&
    process.env.REDIS_REST_URL &&
    process.env.REDIS_REST_TOKEN
  ) {
    rateLimit = getDistrubutedRateLimiter(requests, seconds);
  }
  if (!rateLimit) {
    rateLimit = getStaticRateLimiter(requests, seconds);
  }
  return rateLimit;
};

export default getLimiter;
