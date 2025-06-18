import getRateLimiter, { getIp } from '@shared/rateLimit';
import { NextRequest, NextResponse } from 'next/server';

export const middleware = async (request: NextRequest) => {
  const ip = getIp(request);

  const RateLimiter = getRateLimiter(100, 600); // 100 requests per 10 minutes
  const { success } = await RateLimiter.limit(ip);

  if (!success) {
    return new NextResponse('Too many requests', { status: 429 });
  }

  const { pathname } = request.nextUrl;

  const isPublicPath = pathname.startsWith('/public');
  const isWellKnownPath = pathname.startsWith('/.well-known');

  if (isPublicPath || isWellKnownPath) {
    return new NextResponse(null, { status: 404 });
  }

  const response = NextResponse.next();

  return response;
};

export const config = {
  matcher: ['/api/:path*', '/((?!_next|static|favicon.ico|.*\\..*).*)'],
};
