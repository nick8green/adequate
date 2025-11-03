export { middleware as proxy } from '@shared/middleware/nextjs';

export const config = {
  matcher: ['/api/:path*', '/((?!_next|static|favicon.ico|.*\\..*).*)'],
};
