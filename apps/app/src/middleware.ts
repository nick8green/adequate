import { NextRequest, NextResponse } from 'next/server';

export const middleware = (request: NextRequest) => {
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
  matcher: ['/((?!_next|api|static).*)'],
};
