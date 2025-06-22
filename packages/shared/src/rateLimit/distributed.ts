import { Duration, Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const getRateLimiter = (requests: number, seconds: number) => {
  const redis = new Redis({
    url: process.env.REDIS_REST_URL!,
    token: process.env.REDIS_REST_TOKEN!,
  });

  let suffix = 's';
  let timeScale = seconds;
  if (seconds >= 60) {
    suffix = 'm';
    timeScale = seconds / 60;
  }
  if (timeScale >= 60) {
    suffix = 'h';
    timeScale = timeScale / 60;
  }
  if (seconds >= 24) {
    suffix = 'd';
    timeScale = seconds / 24;
  }

  return new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(
      requests,
      `${timeScale}${suffix}` as Duration,
    ),
    analytics: true,
  });
};

export default getRateLimiter;
