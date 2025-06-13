import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  const isPublicPath = pathname.startsWith('/public');
  const isWellKnownPath = pathname.startsWith('/.well-known');

  if (isPublicPath || isWellKnownPath) {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/((?!_next|api|static).*)'],
};
