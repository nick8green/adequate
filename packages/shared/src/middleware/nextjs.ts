import getRateLimiter, { getIp } from '@shared/rateLimit';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';

type RequestDetails = {
  host: string;
  ip: string;
  method: string;
  path: string;
  referrer: string;
  responseTime?: number;
  requestId: string;
  session?: string;
  status?: number;
  time: Date;
  url: string;
  user?: string;
  userAgent: string;
};

let hostname: string;

export const middleware = async (request: NextRequest) => {
  const ip = getIp(request),
    start = new Date(),
    { pathname } = request.nextUrl,
    reqDetails: RequestDetails = {
      host: request.headers.get('host') || '',
      ip,
      method: request.method,
      path: pathname,
      referrer: request.headers.get('referer') || '',
      requestId: request.headers.get('x-request-id') || uuid(),
      session: request.cookies.get('n8g-track-session')?.value,
      time: start,
      url: request.url,
      user: undefined,
      userAgent: request.headers.get('user-agent') || '',
    };

  if (!hostname) {
    hostname = `${request.nextUrl.protocol}//${request.nextUrl.host}`;
  }

  const isPublicPath = pathname.startsWith('/public');
  const isWellKnownPath = pathname.startsWith('/.well-known');

  if (isPublicPath || isWellKnownPath) {
    logRequest(reqDetails, 404);
    return new NextResponse(null, { status: 404 });
  }

  const RateLimiter = getRateLimiter();
  const { success } = await RateLimiter.limit(ip);

  if (!success) {
    logRequest(reqDetails, 429);
    return new NextResponse('Too many requests', { status: 429 });
  }

  const response = NextResponse.next();
  logRequest(reqDetails, response.status);
  response.headers.set('x-request-id', reqDetails.requestId);
  return response;
};

const logRequest = async (details: RequestDetails, status: number) => {
  if (
    details.url.endsWith('/metrics') ||
    details.url.endsWith('/status') ||
    !/\/((?!_next|static|favicon.ico|.*\..*).*)/.test(details.url) ||
    details.url.includes('/assets')
  ) {
    return;
  }

  details.responseTime = Date.now() - details.time.getTime();
  details.status = status;

  reportMetric({
    name: 'responseTime',
    route: details.path,
    statusCode: String(status),
    responseTime: details.responseTime,
  });
  console.log('referrer:', `${details.referrer}`);
  // if (details.referrer !== '') {
  //   reportMetric({
  //     name: 'pageTransition',
  //     from: details.referrer.replace(hostname, ''),
  //     session: details.session || '',
  //     to: details.path,
  //   });
  // }

  console.log(
    `Page request [${details.time.toISOString()}] ${details.method} ${details.url} ${details.status} - ${details.responseTime}ms - IP: ${details.ip} - UA: ${details.userAgent} - Referrer: ${details.referrer} - ReqID: ${details.requestId}`,
  );
};

const reportMetric = (body: object) => {
  console.log('Reporting metric:', body, hostname);
  fetch(`${hostname}/metrics`, {
    body: JSON.stringify(body),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }).catch((error) => {
    console.error('error reporting metric:', error);
  });
};
