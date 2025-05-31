import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  const isPublicPath = pathname.startsWith('/public');
  const isWellKnownPath = pathname.startsWith('/.well-known');

  if (isPublicPath || isWellKnownPath) {
    return new NextResponse(null, { status: 404 });
  }

  // const hostname = request.nextUrl.hostname;
  // const brand = hostname.includes('client1') ? 'brand-a' : 'brand-b';
  const brand = 'n8g';

  const response = NextResponse.next();
  response.headers.set('x-brand', brand);

  return response;
};

export const config = {
  matcher: ['/((?!_next|api|static).*)'],
};
