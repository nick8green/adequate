export const getRateLimiter = (requests: number, seconds: number) => {
  const ipCache = new Map<string, { count: number; expires: number }>();

  return {
    limit: async (ip: string) => {
      const now = Date.now();
      const windowMs = seconds * 1000;

      let entry = ipCache.get(ip);

      if (!entry || now > entry.expires) {
        entry = { count: 1, expires: now + windowMs };
        ipCache.set(ip, entry);
        return { success: true };
      }

      if (entry.count >= requests) {
        return { success: false };
      }

      entry.count++;
      return { success: true };
    },
  };
};

export default getRateLimiter;
