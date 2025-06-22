import getRateLimiter from '@shared/rateLimit';
import { getIp } from '@shared/rateLimit/ip';
import { NextRequest, NextResponse } from 'next/server';

const limiter = async (request: NextRequest) => {
  const ip = getIp(request);
  const limiter = getRateLimiter(); // 100 requests per 10 minutes
  const { success } = await limiter.limit(ip);

  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
};

export default limiter;
