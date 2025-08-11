import { Duration, Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const getRateLimiter = (requests: number, seconds: number) => {
  const redis = new Redis({
    url: process.env.REDIS_REST_URL!,
    token: process.env.REDIS_REST_TOKEN!,
  });

  let suffix = 's';
  let timeScale = seconds;
  let minutes, hours;
  if (seconds >= 60) {
    suffix = 'm';
    minutes = seconds / 60;
    timeScale = minutes;
  }
  if (minutes && minutes >= 60) {
    suffix = 'h';
    hours = minutes / 60;
    timeScale = hours;
  }
  if (hours && hours >= 24) {
    suffix = 'd';
    timeScale = hours / 24;
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
