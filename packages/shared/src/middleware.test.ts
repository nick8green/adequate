/**
 * @jest-environment node
 */

import { NextRequest, NextResponse } from 'next/server';

import { middleware } from './middleware';
const mockGetRateLimiter = require('@shared/rateLimit').default; // eslint-disable-line @typescript-eslint/no-require-imports
const mockGetIp = require('@shared/rateLimit').getIp; // eslint-disable-line @typescript-eslint/no-require-imports

jest.mock('@shared/rateLimit', () => ({
  __esModule: true,
  default: jest.fn(),
  getIp: jest.fn(),
}));

describe('middleware', () => {
  let mockRequest: Partial<NextRequest>;
  let limitMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {
      nextUrl: { pathname: '/api/test' },
    };
    mockGetIp.mockReturnValue('127.0.0.1');
    limitMock = jest.fn();
    mockGetRateLimiter.mockReturnValue({ limit: limitMock });
  });

  it('allows request when rate limit passes and path is not public or well-known', async () => {
    limitMock.mockResolvedValue({ success: true });

    // @ts-expect-error could be an issue with the data/logic
    const res = await middleware(mockRequest as NextRequest);

    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).toBe(200);
  });

  it('blocks request when rate limit fails', async () => {
    limitMock.mockResolvedValue({ success: false });

    // @ts-expect-error could be an issue with the data/logic
    const res = await middleware(mockRequest as NextRequest);

    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).toBe(429);
    const text = await res.text();
    expect(text).toBe('Too many requests');
  });

  it('returns 404 for /public path', async () => {
    limitMock.mockResolvedValue({ success: true });
    mockRequest.nextUrl = { pathname: '/public/something' };

    // @ts-expect-error could be an issue with the data/logic
    const res = await middleware(mockRequest as NextRequest);

    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).toBe(404);
  });

  it('returns 404 for /.well-known path', async () => {
    limitMock.mockResolvedValue({ success: true });
    mockRequest.nextUrl = { pathname: '/.well-known/acme-challenge' };

    // @ts-expect-error could be an issue with the data/logic
    const res = await middleware(mockRequest as NextRequest);

    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).toBe(404);
  });

  it('calls getIp with the request', async () => {
    limitMock.mockResolvedValue({ success: true });

    // @ts-expect-error could be an issue with the data/logic
    await middleware(mockRequest as NextRequest);

    expect(mockGetIp).toHaveBeenCalledWith(mockRequest);
  });

  it('calls rate limiter with the IP', async () => {
    limitMock.mockResolvedValue({ success: true });

    // @ts-expect-error could be an issue with the data/logic
    await middleware(mockRequest as NextRequest);

    expect(limitMock).toHaveBeenCalledWith('127.0.0.1');
  });
});
